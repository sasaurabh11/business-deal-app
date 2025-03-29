import express from "express"
import cors from 'cors'
import 'dotenv/config'
import cookieParser from "cookie-parser"
import connectDB from "./config/db.js"

import http from 'http'
import { Server } from "socket.io"

connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server,{
  cors:{
    origin: '*',
  }
});
app.use(cors());
app.use(cookieParser())
app.use(express.json());
app.use(express.json({limit: '10mb'}));

// Routes
import userRoutes from './routes/user.router.js';
app.use('/api/user', userRoutes);

import dealRoutes from './routes/deal.router.js';
app.use('/api/deals',dealRoutes);
// app.use('/api/chat',chatRoutes);
// app.use('/api/documents',documentRoutes);

app.get("/", (req, res) => { 
  res.send("App started");
});
app.all("*", (req, res) => {
  res.status(404).send("Can't find the requested route");
})

io.on('connection', (socket) => {
  console.log('A user connected with: ', socket.id);

  socket.on('joinRoom', (dealId) => {
    socket.join(dealId);
    console.log(`User joined deal room: ${dealId}`);
  });

  socket.on('chatPrice', ({ dealId, newPrice }) => {
    console.log(`New price negotiation in deal ${dealId}: $${newPrice}`);
    io.to(dealId).emit('priceUpdated', { dealId, newPrice });
  });

  socket.on('sendMessage', ({ dealId, senderId, receiverId, content }) => {
    const message = { dealId, senderId, receiverId, content, isRead: false };
    io.to(dealId).emit('newMessage', message);
  });

  socket.on('typing', ({ dealId, userId }) => {
    socket.to(dealId).emit('userTyping', { userId });
  });

  socket.on('readMessages', ({ dealId }) => {
    io.to(dealId).emit('messagesRead');
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port http://localhost:${PORT}`));
