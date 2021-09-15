const express = require('express'),
      app = express(),
      server = require('http').createServer(app)
      io = require('socket.io')(server, {
          cors: "*"
      }),
app.use(express.json());

const mongoose = require('./database/mongoose')
const Post = require('./database/models/post');

const sockets = new Set();

io.on('connection', socket => {
    sockets.add(socket);
    console.log(`Socket ${socket.id} added`);

    socket.on('posts-updated', () => {
        Post.find({}).then(posts => {
            console.log(posts)
            socket.send(posts)
        })
    });

    socket.on('disconnect', () => {
        console.log(`Deleting socket: ${socket.id}`)
        sockets.delete(socket);
    })
})

/*
localhost:3000 is backend
localhost:4200 is frontend
*/

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

/*
Post: Create, Update, ReadOne, ReadAll, Delete
RESTful API
*/

app.get('/posts', (req,res) =>{
    Post.find({})
        .then(posts => res.send(posts))
        .catch((error) => console.log(error));
});

app.get('/posts/:postId', (req, res) => {
    Post.findOne({ _id: req.params.postId})
        .then(post => res.send(post))
        .catch((error) => {
            console.log(error);
            res.status(400).send({
                message: "List doesn't exist"
            })
        })
});

app.post('/posts', (req,res) => {
    (new Post({ 'title': req.body.title, 'content': req.body.content}))
        .save()
        .then((post) =>  {
            sockets.forEach(s => s.emit('posts-updated'))
            res.send(post)
        })
        .catch((error) => {
            console.log(error);
            res.status(400).send({
                message: "Bad request"
            })
        })
});

app.put('/posts/:postId', (req, res) => {
    Post.findOneAndUpdate({ '_id': req.params.postId }, { $set: req.body }, { new: true })
        .then((post) =>  {
            sockets.forEach(s => s.emit('posts-updated'))
            res.send(post)
        })
        .catch((error) => {
            console.log(error);
            res.status(400).send({
                message: "Bad request"
            })
        })
});

app.delete('/posts/:postId', (req, res) => {
    Post.findByIdAndDelete(req.params.postId)
        .then((post) =>  {
            sockets.forEach(s => s.emit('posts-updated'))
            res.send(post)
        })
            .catch((error) => {
            console.log(error);
            res.status(400).send({
                message: "Bad request"
            })
        })
});

server.listen(3000, () => console.log("Server Connected"))