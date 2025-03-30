import express from "express"
import cors from 'cors'
import 'dotenv/config'
import cookieParser from "cookie-parser"
import connectDB from "./config/db.js"

import http from 'http'
import { Server } from "socket.io"

const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [process.env.CORS_ORIGIN],
    credentials: true
  }
});
app.use(cors({
  origin: [process.env.CORS_ORIGIN],
  credentials: true
}))
app.use(cookieParser())
app.use(express.json());
app.use(express.json({ limit: '10mb' }));

// Routes
import userRoutes from './routes/user.router.js';
app.use('/api/v1/user', userRoutes);

import dealRoutes from './routes/deal.router.js';
app.use('/api/v1/deals', dealRoutes);

import chatRoutes from './routes/chat.router.js';
app.use('/api/v1/chat', chatRoutes);

import documentRoutes from './routes/documents.router.js';
app.use('/api/v1/documents', documentRoutes);

import analyticsRoutes from './routes/analytics.router.js';
app.use('/api/v1/analytics', analyticsRoutes);

app.get("/", (req, res) => {
  res.send("App started");
});
app.all("*", (req, res) => {
  res.status(404).send("Can't find the requested route");
})

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  const joinRoom = (dealId) => {
    socket.join(dealId);
    console.log(`User joined deal room: ${dealId}`);
  };

  const chatPrice = ({ dealId, newPrice }) => {
    console.log(`Price update in deal ${dealId}: $${newPrice}`);
    io.to(dealId).emit('priceUpdated', { dealId, newPrice });
  };

  const sendMessage = ({ dealId, senderId, receiverId, content }) => {
    const message = { dealId, senderId, receiverId, content, isRead: false };
    io.to(dealId).emit('newMessage', message);
  };

  const typing = ({ dealId, userId }) => {
    socket.to(dealId).emit('userTyping', { userId });
  };

  const readMessages = ({ dealId }) => {
    io.to(dealId).emit('messagesRead');
  };

  socket.on('joinRoom', joinRoom);
  socket.on('chatPrice', chatPrice);
  socket.on('sendMessage', sendMessage);
  socket.on('typing', typing);
  socket.on('readMessages', readMessages);

  socket.on('disconnect', () => console.log(`User disconnected: ${socket.id}`));
});

connectDB().then(() => {
  server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}).catch(err => {
  console.error('Database connection failed:', err);
  process.exit(1);
});
