const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

   //--------------------->room id
   socket.on("join_room",(data)=>{
    socket.join(data);
    console.log(`User with Id:${socket.id} joined a room: ${data}`)
   })
   //-------------------->send message
   socket.on("send_message",(data)=>{
    socket.to(data.room).emit("recieve_message",data);
   })


  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server live at ${PORT}`);
});
