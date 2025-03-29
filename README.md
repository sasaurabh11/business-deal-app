# Virtual Deal Room

A real-time platform for buyers and sellers to negotiate deals, share documents, and securely finalize transactions.

## Features

- User Authentication (JWT-based)
- Real-time Deal Negotiation
- Document Management with Access Control
- Real-time Chat with Typing Indicators
- Deal Status Tracking
- Secure File Upload
- Role-based Access Control

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/sasaurabh11/virtual-deal-room.git
cd virtual-deal-room
```

2. Install dependencies:
```bash
cd backend
npm install
```

3. Create a `.env` file in the backend directory with the following variables:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/virtual-deal-room
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

4. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user
- GET /api/auth/profile - Get user profile

### Deals
- POST /api/deals - Create a new deal
- GET /api/deals - Get all deals
- GET /api/deals/:id - Get single deal
- PUT /api/deals/:id/price - Update deal price
- PUT /api/deals/:id/status - Update deal status
- POST /api/deals/:id/documents - Upload document to deal

### Chat
- POST /api/chat/:dealId/messages - Send a message
- GET /api/chat/:dealId/messages - Get messages
- PUT /api/chat/:dealId/messages/read - Mark messages as read
- GET /api/chat/:dealId/unread-count - Get unread message count

### Documents
- GET /api/documents/:dealId - Get documents for a deal
- POST /api/documents/:dealId/upload - Upload a document
- PUT /api/documents/:dealId/:documentId/access - Update document access
- DELETE /api/documents/:dealId/:documentId - Delete a document

## Socket.IO Events

### Client to Server
- joinRoom - Join a deal room
- negotiatePrice - Update deal price
- sendMessage - Send a message
- typing - User typing indicator
- readMessages - Mark messages as read

### Server to Client
- priceUpdated - Deal price updated
- newMessage - New message received
- userTyping - User typing indicator
- messagesRead - Messages marked as read

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Secure file upload with multer
- Document access control
- Input validation and sanitization

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 