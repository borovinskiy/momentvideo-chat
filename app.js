/*
 * Chat configuration
 */
var chatPort = 3000;
 
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , os = require('os')
  , socketioPort = 8001
  , socketioHost = os.networkInterfaces()['eth0'][0]['address'];

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);

app.get('/moment', function(req, res){
    res.render('moment', { title: 'Chat', host: socketioHost, port: socketioPort })
  }
);

app.get('/playlist.json', function(req,res) {
    res.contentType('application/json');
    var channel = [
      [ 'Best Quality', 'rtmp://' + socketioHost + ':1935', '1' ],
      [ 'Low Quality', 'rtmp://' + socketioHost + ':1935', '2' ],
      [ 'Test', 'rtmp://212.192.64.175', '1' ],
      [ 'Test2', 'rtmp://' + socketioHost + ':1935', '1']
    ];
//    res.send(JSON.stringify(channel));
    res.send((channel));
  }
);


app.listen(chatPort, function(){
 // console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});


// Подключаем модуль и ставим на прослушивание 8001-порта - 80й обычно занят под http-сервер
var io = require('socket.io').listen(socketioPort);
console.log(io); 
// Отключаем вывод полного лога - пригодится в production'е
//io.set('log level', 1);
// Навешиваем обработчик на подключение нового клиента
io.sockets.on('connection', function (socket) {
    // Т.к. чат простой - в качестве ников пока используем первые 5 символов от ID сокета
    var ID = (socket.id).toString().substr(0, 5);
    var time = (new Date).toLocaleTimeString();
    var nick;

    socket.on('nick', function (data) {
      nick = data.nick;
    });
    // Посылаем клиенту сообщение о том, что он успешно подключился и его имя
    socket.json.send({'event': 'connected', 'name': nick, 'time': time});
    // Посылаем всем остальным пользователям, что подключился новый клиент и его имя
    socket.broadcast.json.send({'event': 'userJoined', 'name': nick, 'time': time});
    // Навешиваем обработчик на входящее сообщение
    socket.on('message', function (msg) {
        var time = (new Date).toLocaleTimeString();
        msg = unescape(msg).replace('<', '&lt;').replace('>', '&gt;');
        // Уведомляем клиента, что его сообщение успешно дошло до сервера
        socket.json.send({'event': 'messageSent', 'name': nick, 'text': msg, 'time': time});
        // Отсылаем сообщение остальным участникам чата
        socket.broadcast.json.send({'event': 'messageReceived', 'name': nick, 'text': msg, 'time': time})
        //console.log(msg);
    });
    // При отключении клиента - уведомляем остальных
    socket.on('disconnect', function() {
        var time = (new Date).toLocaleTimeString();
        io.sockets.json.send({'event': 'userSplit', 'name': nick, 'time': time});
    });
});
