//create web server
var http = require('http');
var express = require('express');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var bodyParser = require('body-parser');
var fs = require('fs');

//set view engine
app.set('view engine', 'ejs');
app.set('views', './views');

//use body-parser
app.use(bodyParser.urlencoded({extended: false}));

//set public folder
app.use(express.static('public'));

//listen port
server.listen(3000);

//get home page
app.get('/', function(req, res){
  res.render('home');
});

//get comment from client
var comments = [];
io.sockets.on('connection', function(socket){
  socket.on('client-send-comment', function(data){
    comments.push(data);
    io.sockets.emit('server-send-comment', data);
  });
});

//get comment from server
app.post('/comment', function(req, res){
  var comment = req.body.comment;
  var data = {
    comment: comment
  };
  res.render('home', {data: data});
});

//write comment to file
app.post('/write', function(req, res){
  var comment = req.body.comment;
  fs.appendFile('comment.txt', comment + '\n', function(err){
    if(err){
      res.send('Error!');
    }else{
      res.send('Success!');
    }
  });
});

//read comment from file
app.get('/read', function(req, res){
  fs.readFile('comment.txt', 'utf8', function(err, data){
    if(err){
      res.send('Error!');
    }else{
      var arr = data.split('\n');
      res.render('home', {comments: arr});
    }
  });
});