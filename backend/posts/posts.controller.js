const express = require('express');
const router = express.Router();
const jwt = require('../jwt')
const mongoose = require('../mongoose')
const Post = require('./post');

module.exports = function (sockets) {

    router.get('/', (req,res) =>{
        Post.find({})
            .then(posts => res.send(posts))
            .catch((error) => console.log(error));
    });

    router.get('/:postId', (req, res) => {
        Post.findOne({ '_id': req.params.postId})
            .then(post => {res.send(post)})
            .catch((error) => {
                console.log(error);
                res.status(400).send({
                    message: "List doesn't exist"
                })
            })
    });

    router.post('/', jwt, (req,res) => {
        (new Post({ 'title': req.body.title, 'content': req.body.content, 'postedBy': req.user.userId }))
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

    router.put('/:postId', jwt, (req, res) => {
        if(req.user.admin) {
            Post.findByIdAndUpdate(req.params.postId, { $set: req.body }, { new: true })
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
        }
        else {
            Post.findOneAndUpdate({ '_id': req.params.postId, 'postedBy': req.user.userId }, { $set: req.body }, { new: true })
                .then((post) =>  {
                    if(post) {
                        sockets.forEach(s => s.emit('posts-updated'))
                        res.send(post)
                    }
                    else {
                        res.status(401).send({
                            message: "Not authorised to edit this post"
                        })
                    }
                })
                .catch((error) => {
                    console.log(error);
                    res.status(400).send({
                        message: "Bad request"
                    })
                })
        }
    });

    router.delete('/:postId', jwt, (req, res) => {
        if(req.user.admin) {
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
        }
        else {
            Post.findOneAndDelete({ '_id': req.params.postId, 'postedBy': req.user.userId })
                .then((post) =>  {
                    if(post) {
                        sockets.forEach(s => s.emit('posts-updated'))
                        res.send(post)
                    }
                    else {
                        res.status(401).send({
                            message: "Not authorised to edit this post"
                        })
                    }
                })
                    .catch((error) => {
                    console.log(error);
                    res.status(400).send({
                        message: "Bad request"
                    })
                })
        }
    });

    return router;
}