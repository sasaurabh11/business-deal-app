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
  uploadDocs,
  getDocs,
} from "../services/api";
import {
  FiSend,
  FiX,
  FiClock,
  FiFile,
  FiDownload,
  FiChevronLeft,
} from "react-icons/fi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { ImAttachment } from "react-icons/im";
import { format, parseISO } from "date-fns";

const ChatModal = ({ dealId, otherUser, onClose }) => {
  const { socket, currentChat, user } = useContext(AppContext);
  const [messages, setMessages] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDocuments, setShowDocuments] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const fileInputRef = useRef(null);

  const getSafeUserName = (userObj) => {
    if (!userObj) return "U";
    return (userObj.name || userObj.username || "U").charAt(0).toUpperCase();
  };

  const getSafeDisplayName = (userObj) => {
    if (!userObj) return "Unknown User";
    return userObj.name || userObj.username || "Unknown User";
  };

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [messagesRes, docsRes] = await Promise.all([
        await getMessagesApi(dealId),
        await getDocs(dealId),
      ]);

      if (messagesRes?.success) {
        setMessages(messagesRes.data || []);
      }
      if (docsRes?.success) {
        setDocuments(docsRes.documents || []);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Error loading chat data");
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
          createdAt: message.createdAt || new Date().toISOString(),
        };
        setMessages((prev) => [...prev, transformedMsg]);
      });

      socket.on("userTyping", ({ userId }) => {
        if (userId !== user?._id) {
          setIsTyping(true);
          clearTimeout(typingTimeoutRef.current);
          typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 2000);
        }
      });
    };

    const initializeChat = async () => {
      try {
        await fetchData();
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
        socket.emit("leaveRoom", dealId);
      }
      clearTimeout(typingTimeoutRef.current);
    };
  }, [dealId, socket, user?._id, fetchData]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket || !user?._id || !otherUser?._id) return;

    try {
      const response = await sendMessageApi({
        dealId,
        receiverId: otherUser._id,
        message: newMessage,
      });

      if (response?.success) {
        socket.emit("sendMessage", {
          dealId,
          senderId: user._id,
          receiverId: otherUser._id,
          content: newMessage,
          _id: response.data._id,
          createdAt: response.data.createdAt || new Date().toISOString(),
          isRead: false,
        });
        setNewMessage("");
      }
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Failed to send message");
    }
  };

  const handleDocumentUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file", file); 
      formData.append("dealId", dealId);

      const allowedUsers = [otherUser._id, user._id];
      formData.append("allowedUsers", JSON.stringify(allowedUsers));

      const response = await uploadDocs(formData);

      if (response.success) {
        setDocuments((prev) => [...prev, response.document]);
      }
    } catch (err) {
      console.error("Document upload failed:", err);
    }
  };

  const formatMessageTime = (dateString) => {
    try {
      return format(parseISO(dateString), "h:mm a");
    } catch {
      return format(new Date(), "h:mm a");
    }
  };

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-gray-800 rounded-xl w-full max-w-md p-6 shadow-2xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-white">Chat Error</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <FiX size={24} />
            </button>
          </div>
          <div className="text-red-400 mb-6 text-lg">{error}</div>
          <button
            onClick={fetchData}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 px-6 rounded-lg transition-colors font-medium"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex flex-col z-50">
      {/* Header */}
      <div className="bg-gray-800 py-4 px-6 flex justify-between items-center border-b border-gray-700">
        <div className="flex items-center space-x-4">
          {showDocuments && (
            <button
              onClick={() => setShowDocuments(false)}
              className="text-gray-300 hover:text-white transition-colors"
            >
              <FiChevronLeft size={24} />
            </button>
          )}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold">
              {getSafeUserName(otherUser)}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">
                {getSafeDisplayName(otherUser)}
              </h3>
              <div className="flex items-center text-xs text-gray-400">
                <FiClock className="mr-1" size={14} />
                <span>Active now</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => setShowDocuments(!showDocuments)}
            className="text-gray-300 hover:text-white transition-colors rounded-2xl flex items-center h-12"
          >
            <FiFile size={20} />
            <h1 className="text-white">Deal Docs</h1>
          </button>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-white transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-gray-900 overflow-hidden">
        {showDocuments ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium text-lg">Deal Documents</h4>
              <button
                onClick={() => setShowDocuments(false)}
                className="text-blue-400 text-sm"
              >
                Back to Chat
              </button>
            </div>

            {documents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {documents.map((doc) => (
                  <div
                    key={doc._id}
                    className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-indigo-500 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <FiFile className="text-indigo-400 mr-2" />
                          <span className="text-white font-medium truncate">
                            {doc.docsUrl.split("/").pop()}{" "}
                            {/* Show filename from URL */}
                          </span>
                        </div>

                        <div className="text-xs text-gray-400 mb-2">
                          <div>
                            Uploaded by:{" "}
                            {doc.uploadedBy === user._id ? "You" : "Partner"}
                          </div>
                          <div>
                            {format(
                              parseISO(doc.createdAt),
                              "MMM d, yyyy h:mm a"
                            )}
                          </div>
                        </div>

                        <div className="text-xs text-gray-400">
                          {doc.accessUser.length}{" "}
                          {doc.accessUser.length === 1 ? "user" : "users"} have
                          access
                        </div>
                      </div>

                      <a
                        href={doc.docsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-400 hover:text-indigo-300 ml-2"
                        title="Download"
                      >
                        <FiDownload size={18} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FiFile className="mx-auto text-gray-500" size={48} />
                <p className="mt-4 text-gray-400">No documents uploaded yet</p>
              </div>
            )}

            <div className="mt-8 border-t border-gray-700 pt-6">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleDocumentUpload}
                className="hidden"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.png,.jpg,.jpeg"
              />
              <button
                onClick={() => fileInputRef.current.click()}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 px-6 rounded-lg transition-colors font-medium flex items-center justify-center"
              >
                <ImAttachment className="mr-2" />
                Upload New Document
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-4xl mx-auto space-y-4">
                {isLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="animate-pulse text-gray-400">
                      Loading messages...
                    </div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="text-center">
                      <div className="text-gray-400 text-lg">
                        No messages yet
                      </div>
                      <p className="text-gray-500 mt-2">
                        Start the conversation
                      </p>
                    </div>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg._id}
                      className={`flex ${
                        msg.sender === user?._id
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-md p-4 rounded-xl relative ${
                          msg.sender === user?._id
                            ? "bg-indigo-600 text-white rounded-tr-none"
                            : "bg-gray-700 text-gray-100 rounded-tl-none"
                        }`}
                      >
                        <p className="break-words text-sm">
                          {msg.message || msg.content}
                        </p>
                        <p className="text-xs mt-2 opacity-80 flex justify-end items-center space-x-1">
                          <span>{formatMessageTime(msg.createdAt)}</span>
                          {msg.isRead && (
                            <span className="text-indigo-300">✓✓</span>
                          )}
                        </p>
                      </div>
                    </div>
                  ))
                )}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-700 text-gray-100 p-3 rounded-xl rounded-tl-none max-w-xs">
                      <div className="flex space-x-1">
                        {[...Array(3)].map((_, i) => (
                          <div
                            key={i}
                            className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                            style={{ animationDelay: `${i * 0.2}s` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Message Input */}
            <div className="bg-gray-800 border-t border-gray-700 p-4">
              <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto">
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    className="text-gray-400 hover:text-indigo-400 p-2 transition-colors"
                    onClick={() => fileInputRef.current.click()}
                  >
                    <ImAttachment size={20} />
                  </button>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => {
                      setNewMessage(e.target.value);
                      if (socket && user?._id) {
                        socket.emit("typing", { dealId, userId: user._id });
                      }
                    }}
                    placeholder="Type your message..."
                    className="flex-1 bg-gray-700 text-white rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-gray-600 focus:border-indigo-500 transition-all"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className={`p-3 rounded-full transition-colors ${
                      newMessage.trim()
                        ? "bg-indigo-600 text-white hover:bg-indigo-500"
                        : "bg-gray-700 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    <FiSend size={20} />
                  </button>
                </div>
              </form>
            </div>
          </>
        )}
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleDocumentUpload}
        className="hidden"
      />
    </div>
  );
};

export default ChatModal;
