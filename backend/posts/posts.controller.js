const express = require('express');
const router = express.Router();
const mongoose = require('../mongoose')
const Post = require('./post');

module.exports = function (sockets) {

    router.get('/', (req,res) =>{
        Post.find({})
            .then(posts => res.send(posts))
            .catch((error) => console.log(error));
    });

    router.get('/:postId', (req, res) => {
        Post.findOne({ _id: req.params.postId})
            .then(post => res.send(post))
            .catch((error) => {
                console.log(error);
                res.status(400).send({
                    message: "List doesn't exist"
                })
            })
    });

    router.post('/', (req,res) => {
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

    router.put('/:postId', (req, res) => {
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

    router.delete('/:postId', (req, res) => {
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

    return router;
}