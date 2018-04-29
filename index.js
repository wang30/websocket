window.onload = function() {
  const $ = (selector) => {
    return document.querySelector(selector)
  }
  const notEmpty = (s) => {                   // 检测字符串中是否只有空格
    s = s.replace(/^\s+/, '')
    s = s.replace(/\s+$/, '')
    return !!s
  }
  const filterSpace = (s) => {                // 过滤字符串收尾的空格
    s = s.replace(/^\s+/,'')
    s = s.replace(/\s+$/,'')
    return s    
  }
  const createMsg = (data) => {               // 添加聊天信息
    const node = document.createElement('li')
    const nameSpan = document.createElement('span')
    const msgSpan = document.createElement('span')

    nameSpan.innerText = data.userName
    nameSpan.style.color = data.nameColor
    msgSpan.innerText = ' : ' + data.msg

    node.appendChild(nameSpan)
    node.appendChild(msgSpan)
    $('.messages').appendChild(node)
  }
  const createTip = (msg) => {                // 创建提示信息
    const node = this.document.createElement('li')
    node.innerText = msg
    node.style.color = 'gray';
    node.style.textAlign = 'center'
    $('.messages').appendChild(node)
  }

  let userName = ''
  const socket = io()


  $('.usernameInput').addEventListener('keydown', (event)=>{       // 输入昵称后
    const content = $('.usernameInput').value

    if(event.key === 'Enter' && notEmpty(content)) {
      userName = filterSpace(content)
      enterChat()
    }
  })

  const enterChat = () => {                             // 进入聊天页面
    createTip('Welcome to Socket.IO Chat')

    socket.emit('login', {userName})
    $('.chat.page').style.display = 'block'
    $('.inputMessage').focus()
    $('.login.page').style.display = 'none'
  }

  $('.inputMessage').addEventListener('keydown', (event)=>{     // 发送消息
    let content = $('.inputMessage').value

    if(event.key === 'Enter' && notEmpty(content)) {
      content = filterSpace(content)
      socket.emit('sendMsg', {userName, msg: content})
      $('.inputMessage').value = ''
    }
  })
  
  socket.on('broadcast', (data) => {                            // 广播消息
    createMsg(data)
  })
  socket.on('broadcast to self', (data) => {                    // 广播给自己
    createMsg(data)
  })

  socket.on('user left', ({userName}) => {
    createTip(`${userName} left`)
  })
  socket.on('user joined', ({userName}) => {
    createTip(`${userName} joined`)
  })
}