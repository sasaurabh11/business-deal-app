import React, { useState, useEffect, useRef, useContext } from 'react';
import { AppContext } from '../context/Appcontext';
import chatService from '../services/chatService';

const Chat = ({ dealId }) => {
  const { user } = useContext(AppContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Initialize socket connection
    chatService.initSocket(localStorage.getItem('token'));

    // Join the deal room
    chatService.joinDealRoom(dealId);

    // Load chat history
    loadChatHistory();

    // Set up socket event listeners
    chatService.socket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    chatService.socket.on('typing', (data) => {
      if (data.userId !== user._id) {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 1000);
      }
    });

    // Cleanup on unmount
    return () => {
      chatService.leaveDealRoom(dealId);
      chatService.disconnect();
    };
  }, [dealId, user._id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadChatHistory = async () => {
    try {
      const response = await chatService.getChatHistory(dealId);
      setMessages(response.messages);
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      chatService.sendMessage(dealId, newMessage);
      setNewMessage('');
    }
  };

  const handleTyping = () => {
    chatService.socket.emit('typing', { dealId, userId: user._id });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.userId === user._id ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.userId === user._id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              <div className="text-sm font-semibold mb-1">
                {message.userId === user._id ? 'You' : message.username}
              </div>
              <div>{message.content}</div>
              <div className="text-xs mt-1 opacity-75">
                {new Date(message.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-200 rounded-lg p-3">
              <div className="text-sm text-gray-500">Typing...</div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              handleTyping();
            }}
            placeholder="Type a message..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat; 