import axios from 'axios';
import io from 'socket.io-client';

const API_URL = 'http://localhost:5000/api';
const SOCKET_URL = 'http://localhost:5000';

class ChatService {
  constructor() {
    this.socket = null;
  }

  // Initialize socket connection
  initSocket(token) {
    this.socket = io(SOCKET_URL, {
      auth: {
        token,
      },
    });

    this.socket.on('connect', () => {
      console.log('Connected to chat server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from chat server');
    });
  }

  // Join a deal room
  joinDealRoom(dealId) {
    if (this.socket) {
      this.socket.emit('joinDealRoom', dealId);
    }
  }

  // Leave a deal room
  leaveDealRoom(dealId) {
    if (this.socket) {
      this.socket.emit('leaveDealRoom', dealId);
    }
  }

  // Send a message
  sendMessage(dealId, message) {
    if (this.socket) {
      this.socket.emit('sendMessage', {
        dealId,
        message,
      });
    }
  }

  // Get chat history
  async getChatHistory(dealId) {
    const response = await axios.get(`${API_URL}/chat/${dealId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  }

  // Mark messages as read
  async markMessagesAsRead(dealId) {
    const response = await axios.post(
      `${API_URL}/chat/${dealId}/read`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    return response.data;
  }

  // Disconnect socket
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export default new ChatService(); 