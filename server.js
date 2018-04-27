const express = require('express');
const path = require('path')
const app = express();
const http = require('http')
const fs = require('fs')
const io = require('socket.io')

const server = http.createServer(app)
server.listen(8082)

app.use(express.static(path.join(__dirname, '.')));

const ws = io(server)
ws.on('connection', socket => {
  socket.on('login', (data)=>{
    
  })
  socket.on('sendMsg', (data) => {
    socket.broadcast.emit('broadcast', data)
  })
})
