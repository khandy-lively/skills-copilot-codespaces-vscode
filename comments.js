// Create web server application

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');

// Serve static files from public directory
app.use(express.static('public'));

// Use body-parser middleware for parsing request body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Use EJS as templating engine
app.set('view engine', 'ejs');

// Use port 3000 unless one is set in the env
var port = process.env.PORT || 3000;

// Function for reading the comments file
function readComments(callback) {
    fs.readFile('comments.json', function (err, data) {
        if (err) {
            callback([]);
        } else {
            callback(JSON.parse(data));
        }
    });
}

// Function for writing the comments file
function writeComments(comments, callback) {
    fs.writeFile('comments.json', JSON.stringify(comments, null, 4), function (err) {
        if (err) {
            console.log(err);
        }
        callback();
    });
}

// GET /comments
app.get('/comments', function (req, res) {
    readComments(function (comments) {
        res.json(comments);
    });
});

// POST /comments
app.post('/comments', function (req, res) {
    readComments(function (comments) {
        comments.push(req.body);
        writeComments(comments, function () {
            res.json(comments);
        });
    });
});

// DELETE /comments
app.delete('/comments', function (req, res) {
    writeComments([], function () {
        res.json([]);
    });
});

// Start the server
app.listen(port, function () {
    console.log('Server is running on port ' + port);
});