
//var host = '212.192.94.87';
var port = '8001';

function chat_generate_nick() {

//  nick = document.getElementById('nick-nodechat').value;

//  if ( nick === undefined || nick.toString.length > 0 ) {
//    return nick;	// уже определен ник
//  }
//  else { 
    
    var nickname = Math.floor(Math.random()*1000);
    nickname = 'guest' + nickname.toString();
//  }
  console.log(nickname);
  return nickname;
}

function img_add_nodechat(msg) {
    return '<img width="16" height="16" src="/images/' + msg + '.png"/>';
}

function chat_create_nodejs(nick) {

  if (navigator.userAgent.toLowerCase().indexOf('chrome') != -1) {
    socket = io.connect('http://' + host + ':' + port, {'transports': ['xhr-polling']});
  } else {
    socket = io.connect('http://' + host + ':' + port);
  }


  socket.on('connect', function () {
    socket.on('message', function (msg) {
      if ( msg.event == 'connected' ) {  
        
        socket.emit('nick',{'nick': nick});
        document.querySelector('#log-nodechat').innerHTML += img_add_nodechat(msg.event) + ' Вы вошли в чат.<br />';
      }
      else {
        if ( msg.text !== undefined &&  msg.text.length > 1 ) {
          // Добавляем в лог сообщение, заменив время, имя и текст на полученные
          document.querySelector('#log-nodechat').innerHTML += img_add_nodechat(msg.event) + ' <span class="time-nodechat">' + msg.time + '</span> <span class="user-nodechat">' + msg.name + ':</span> <span class="text-nodechat">' + msg.text + '</span><br />';
            
          // Прокручиваем лог в конец
          document.querySelector('#log-nodechat').scrollTop = document.querySelector('#log-nodechat').scrollHeight;
        }
        else if ( msg.event == 'userJoined' && msg.name !== undefined ) {
          document.querySelector('#log-nodechat').innerHTML += img_add_nodechat(msg.event) + ' <span class="time-nodechat">' + msg.time + ' Пользователь <span class="user-nodechat">' + msg.name + '</span> вошел в чат.<br />';
        }            
        else if ( msg.event == 'userSplit' && msg.name !== undefined ) {
          document.querySelector('#log-nodechat').innerHTML += img_add_nodechat(msg.event) + ' <span class="time-nodechat">' + msg.time + ' Пользователь <span class="user-nodechat">' + msg.name + '</span> вышел из чата.<br />';
        }
      }
    });
    // При нажатии <Enter> или кнопки отправляем текст
    document.querySelector('#input').onkeypress = function(e) {
      if (e.which == '13') {
        // Отправляем содержимое input'а, закодированное в escape-последовательность
        socket.send(escape(document.querySelector('#input').value));
        // Очищаем input
        document.querySelector('#input').value = '';
      }
    };
    document.querySelector('#send').onclick = function() {
      socket.send(escape(document.querySelector('#input').value));
      document.querySelector('#input').value = '';
    };		
  });

};
