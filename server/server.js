const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app); // Create HTTP server
const io = socketIO(server, {
  cors: {
    origin: '*', // Allow requests from all origins
    methods: ['GET', 'POST'],
  },
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((error) => console.error('MongoDB connection error:', error));

// Use user routes
app.use('/api/users', userRoutes);

// Socket.IO signaling logic
io.on('connection', (socket) => {
  console.log('New user connected:', socket.id);

  // Handle creating/joining room
  socket.on('create-room', (roomCode) => {
    socket.join(roomCode);
    console.log(`Room created with code: ${roomCode}`);
  });

  socket.on('join-room', (roomCode) => {
    socket.join(roomCode);
    console.log(`User joined room: ${roomCode}`);
    socket.to(roomCode).emit('user-joined', roomCode);
  });

  // Handle WebRTC signaling (offer/answer/ice-candidate)
  socket.on('offer', (payload) => {
    socket.to(payload.roomCode).emit('offer', payload.sdp);
  });

  socket.on('answer', (payload) => {
    socket.to(payload.roomCode).emit('answer', payload.sdp);
  });

  socket.on('ice-candidate', (payload) => {
    socket.to(payload.roomCode).emit('ice-candidate', payload.candidate);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
