import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  useCallback,
} from "react";
import { AppContext } from "../context/Appcontext";
import {
  sendMessage as sendMessageApi,
  getMessages as getMessagesApi,
} from "../services/api";
import { FiSend, FiX, FiClock } from "react-icons/fi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { ImAttachment } from "react-icons/im";
import { format } from "date-fns";

const ChatModal = ({ dealId, otherUser, onClose }) => {
  console.log(otherUser);
  const { socket, currentChat, user } = useContext(AppContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const getSafeUserName = (userObj) => {
    if (!userObj) return "U";
    if (userObj.name) return userObj.name.charAt(0).toUpperCase();
    if (userObj.username) return userObj.username.charAt(0).toUpperCase();
    return "U";
  };

  const getSafeDisplayName = (userObj) => {
    if (!userObj) return "Unknown User";
    return userObj.name || userObj.username || "Unknown User";
  };

  const fetchMessages = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getMessagesApi(dealId);
      if (response?.success) {
        setMessages(response.data || []);
      } else {
        setError(response?.message || "Failed to load messages");
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
      setError("Error loading chat history");
    } finally {
      setIsLoading(false);
    }
  }, [dealId]);

  useEffect(() => {
    if (!dealId || !socket) {
      setError("Missing required chat parameters");
      return;
    }

    const setupSocketListeners = () => {
      socket.on("newMessage", (message) => {
        const transformedMsg = {
          ...message,
          sender: message.senderId,
          message: message.content,
        };
        setMessages((prev) => [...prev, transformedMsg]);
      });

      socket.on("userTyping", ({ userId }) => {
        if (userId !== user?._id) {
          setIsTyping(true);
          if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
          }
          typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 2000);
        }
      });

      socket.on("priceUpdated", ({ dealId, newPrice }) => {
        console.log(`Price updated for deal ${dealId}: $${newPrice}`);
      });

      socket.on("messagesRead", () => {});
    };

    const initializeChat = async () => {
      try {
        await fetchMessages();
        socket.emit("joinRoom", dealId);
        setupSocketListeners();
      } catch (err) {
        console.error("Chat initialization error:", err);
        setError("Failed to initialize chat");
      }
    };

    initializeChat();

    return () => {
      if (socket) {
        socket.off("newMessage");
        socket.off("userTyping");
        socket.off("priceUpdated");
        socket.off("messagesRead");
        socket.emit("leaveRoom", dealId);
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [dealId, socket, user?._id, fetchMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    console.log(otherUser);
    if (!newMessage.trim() || !socket || !user?._id || !otherUser?._id) return;

    try {
      console.log("Sending message:", newMessage);
      const response = await sendMessageApi({
        dealId,
        receiverId: otherUser._id,
        message: newMessage,
      });

      console.log(response);

      if (response?.success) {
        socket.emit("sendMessage", {
          dealId,
          senderId: user._id,
          receiverId: otherUser._id,
          content: newMessage,
          _id: response.data._id,
          createdAt: response.data.createdAt,
          isRead: false,
        });
        setNewMessage("");
      } else {
        setError(response?.message || "Failed to send message");
      }
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Failed to send message");
    }
  };

  const handleTyping = () => {
    if (socket && user?._id) {
      socket.emit("typing", { dealId, userId: user._id });
    }
  };

  const formatMessageTime = (dateString) => {
    try {
      return format(new Date(dateString), "h:mm a");
    } catch {
      return "";
    }
  };

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-gray-800 rounded-lg w-full max-w-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Chat Error</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <FiX size={20} />
            </button>
          </div>
          <div className="text-red-400 mb-4">{error}</div>
          <button
            onClick={fetchMessages}
            className="bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg w-full max-w-md max-h-[90vh] flex flex-col shadow-xl">
        {/* Header */}
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white font-semibold">
              {getSafeUserName(otherUser)}
            </div>
            <div>
              <h3 className="text-lg font-semibold">
                {getSafeDisplayName(otherUser)}
              </h3>
              <div className="flex items-center text-xs text-gray-400">
                <FiClock className="mr-1" size={12} />
                <span>Active now</span>
              </div>
            </div>
          </div>
          <div className="flex space-x-3">
            <button className="text-gray-400 hover:text-white">
              <BsThreeDotsVertical size={20} />
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <FiX size={20} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900 bg-opacity-50">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-pulse text-gray-400">
                Loading messages...
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex justify-center items-center h-full">
              <div className="text-gray-400 text-center">
                <p>No messages yet</p>
                <p className="text-sm mt-1">Start the conversation</p>
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg._id}
                className={`flex ${
                  msg.sender === user?._id ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs p-3 rounded-lg relative ${
                    msg.sender === user?._id
                      ? "bg-blue-600 text-white rounded-tr-none"
                      : "bg-gray-700 text-gray-100 rounded-tl-none"
                  }`}
                >
                  <p className="break-words">{msg.message || msg.content}</p>
                  <p className="text-xs mt-1 opacity-70 flex justify-end items-center">
                    {formatMessageTime(msg.createdAt)}
                    {msg.isRead && (
                      <span className="ml-1 text-blue-300">✓✓</span>
                    )}
                  </p>
                </div>
              </div>
            ))
          )}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-700 text-gray-100 p-3 rounded-lg rounded-tl-none max-w-xs">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                  <div
                    className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <form
          onSubmit={handleSendMessage}
          className="p-4 border-t border-gray-700"
        >
          <div className="flex items-center space-x-2">
            <button
              type="button"
              className="text-gray-400 hover:text-blue-400 p-2"
            >
              <ImAttachment size={20} />
            </button>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value);
                handleTyping();
              }}
              placeholder="Type your message..."
              className="flex-1 bg-gray-700 text-white rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className={`p-2 rounded-full ${
                newMessage.trim()
                  ? "bg-blue-600 text-white hover:bg-blue-500"
                  : "bg-gray-700 text-gray-500 cursor-not-allowed"
              }`}
            >
              <FiSend size={20} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatModal;
