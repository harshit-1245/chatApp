// Importing required modules
const express = require('express'); // Express framework for creating the server
const cors = require('cors'); // Cors for handling Cross-Origin Resource Sharing
const http = require('http'); // HTTP module for creating the server
const { Server } = require('socket.io'); // Socket.IO for handling WebSocket connections
require('dotenv').config(); // Loading environment variables

// Initializing Express app
const app = express();
const PORT = process.env.PORT || 5000; // Setting the port

app.use(cors()); // Adding CORS middleware to Express

// Creating an HTTP server using Express app
const server = http.createServer(app);

// Initializing Socket.IO server and setting CORS options
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', // Allowing connections from this origin
    methods: ['GET', 'POST'], // Allowing specific HTTP methods
  },
});

// Handling socket connection events
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Handling joining a room
  socket.on("join_room", (data) => {
    socket.join(data); // Joining the specified room
    console.log(`User with Id:${socket.id} joined a room: ${data}`)
  });

  // Handling sending messages within a room
  socket.on("send_message", (data) => {
    socket.to(data.room).emit("recieve_message", data); // Sending the received message to all clients in the room except the sender
  });

   //sending user is typing
   socket.on("typing_status",({user,status,room})=>{
    socket.to(room).emit("user_typing",{user,status});
   });

   
 

  // Handling socket disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });


});

// Making the server listen on the specified port
server.listen(PORT, () => {
  console.log(`Server live at ${PORT}`);
});
