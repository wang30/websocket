const express = require('express')
const path = require('path')
const app = express();
const http = require('http')
const fs = require('fs')
const io = require('socket.io')

const server = http.createServer(app)
server.listen(8082)
// console.log('open http://localhost:8082')

app.use(express.static(path.join(__dirname, '.')))

const randomNum = () => {                   // 生成 0~11 的随机数
  return Math.floor(Math.random()*12)
}  

const COLORS = [
  '#e21400', '#91580f', '#f8a700', '#f78b00',
  '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
  '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
];

const ws = io(server)
ws.on('connection', socket => {
  let userName = ''
  const nameColor = COLORS[randomNum()]

  socket.on('login', (data)=>{                          // 用户进入
    userName = data.userName
    socket.broadcast.emit('user joined', data)
  })
  socket.on('sendMsg', (data) => {                      // 发送消息
    Object.assign(data, {nameColor})
    socket.broadcast.emit('broadcast', data)
    socket.emit('broadcast to self', data)
  })
  socket.on('disconnect', () => {                       // 连接断开
    socket.broadcast.emit('user left', {userName})
  })
})
