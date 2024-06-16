// Create web server
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');
var path = require('path');
var url = require('url');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/comment.html'));
});

app.post('/comment', function(req, res) {
    var name = req.body.name;
    var comment = req.body.comment;
    var data = name + ': ' + comment + '\n';
    fs.appendFile('comment.txt', data, function(err) {
        if (err) {
            res.send('Error');
        } else {
            res.send('Success');
        }
    });
});

app.get('/comment', function(req, res) {
    fs.readFile('comment.txt', 'utf8', function(err, data) {
        if (err) {
            res.send('Error');
        } else {
            res.send(data);
        }
    });
});

var server = app.listen(3000, function() {
    console.log('Server is running at http://localhost:3000');
});