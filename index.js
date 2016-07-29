var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

var player = 1;

var coolingdown = false;

var p1cord = {x: 0, y: 0, num: 0};
var p2cord = {x: 0, y: 0, num: 0};

var collideTest = function(p1, p2) {
	var dis = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
	return dis < 50 ? true : false;
}

io.on('connection', function(socket){
  io.emit('assignNum', player);
  player = 3 - player;
  socket.on('change', function(msg){
  	if (msg.num === 1) {
  		p1cord = msg;
  	} else {
  		p2cord = msg;
  	}

  	if (!coolingdown && collideTest(p1cord, p2cord)) {
  		io.emit('swappnum', true);
  		var temp = p1cord;
  		p1cord = p2cord;
  		p2cord = temp;
  		coolingdown = true;
  		setTimeout(function() {
  			coolingdown = false;
  		}, 3000);
  	}

  	if (msg.num === 1) {
  		io.emit('enemy', p1cord);
  	} else {
  		io.emit('enemy', p2cord);
  	}

  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});