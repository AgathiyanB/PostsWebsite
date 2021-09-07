const express = require('express');
const app = express();
app.use(express.json());

const mongoose = require('./database/mongoose')
const Post = require('./database/models/post')

/*
CORS - Cross Origin Request Security.
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
        .then((post) =>  res.send(post))
        .catch((error) => {
            console.log(error);
            res.status(400).send({
                message: "Bad request"
            })
        })
});

app.put('/posts/:postId', (req, res) => {
    Post.findOneAndUpdate({ '_id': req.params.postId }, { $set: req.body }, { new: true })
        .then((post) =>  res.send(post))
        .catch((error) => {
            console.log(error);
            res.status(400).send({
                message: "Bad request"
            })
        })
});

app.delete('/posts/:postId', (req, res) => {
    Post.findByIdAndDelete(req.params.postId)
        .then((post) => res.send(post))
        .catch((error) => {
            console.log(error);
            res.status(400).send({
                message: "Bad request"
            })
        })
});

app.listen(3000, () => console.log("Server Connected"))