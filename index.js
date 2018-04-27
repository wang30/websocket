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
    const node = this.document.createElement('li')
    node.innerText = `${data.userName} : ${data.msg}`
    $('.messages').appendChild(node)
  }
  const randomNum = () => {                   // 生成 0~11 的随机数
    return Math.floor(Math.random()*12)
  }


  const COLORS = [
    '#e21400', '#91580f', '#f8a700', '#f78b00',
    '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
    '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
  ];
  let userName = ''
  const socket = io('http://localhost:8081')



  const enterChat = () => {                             // 进入聊天页面
    socket.emit('login', {userName})
    $('.chat.page').style.display = 'block'
    $('.login.page').style.display = 'none'
  }

  document.addEventListener('keydown', (event)=>{       // 输入昵称后
    const content = $('.usernameInput').value

    if(event.key === 'Enter' && notEmpty(content)) {
      userName = filterSpace(content)
      enterChat()
    }
  })

  $('.inputMessage').addEventListener('keydown', (event)=>{     // 发送消息
    let content = $('.inputMessage').value

    if(event.key === 'Enter' && notEmpty(content)) {
      content = filterSpace(content)
      socket.emit('sendMsg', {userName, msg: content})
      $('.inputMessage').value = ''
      createMsg({userName, msg: content})
    }
  })
  
  socket.on('broadcast', (data) => {                            // 广播消息
    createMsg(data)
  })

}