// server.js
import mongoose from 'mongoose';
import http from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import dotenv from 'dotenv';
import scheduler from './services/restockScheduler.js';

dotenv.config();

const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGODB_URI;

const server = http.createServer(app);

// Initialize Socket.IO and attach it to the server
const io = new Server(server, {
  cors: {
    origin: [process.env.FRONTEND_URL || "http://localhost:5000"],
    methods: ["GET", "POST"]
  }
});


io.on('connection', (socket) => {
  console.log('✅ A user connected via WebSocket');
  
  // Handle owner room joining for targeted notifications
  socket.on('join_owner_room', (data) => {
    const roomName = `owner_${data.ownerId}`;
    socket.join(roomName);
    console.log(`👤 Owner ${data.ownerId} joined room: ${roomName}`);
  });
  
  socket.on('disconnect', () => {
    console.log('🔌 User disconnected');
  });
});


mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB connected');
    
    scheduler.init(io);

    server.listen(PORT, () => {
      console.log(`🚀 Server with WebSocket running...`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err);
    process.exit(1);
  });