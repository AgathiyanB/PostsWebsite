const express = require('express');
const router = express.Router();
const config = require('../config.json')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const mongoose = require('../mongoose');
const User = require('./user');

router.post('/authenticate',(req, res) => {
    User.findOne({ 'username': req.body.username }).then((user) => {
        if(user && bcrypt.compareSync(req.body.password, user.hash)) {
            const token = jwt.sign({ userId: user.id, admin: user.admin }, config.secret, { expiresIn: '7d' })
            res.send({ token: token, expiresInSeconds: 604800 })
        }
        else {
            res.status(400).send({ message: 'Username or password is incorrect' })
        }
    })
})

router.post('/register',(req,res) => {
    if(!req.body.username) {
        res.status(400).send({
            message: "Bad request"
        })
    }
    User.findOne({ 'username': req.body.username }).then((user) => {
        if(user) {
            res.status(400).send({ message: `Username "${req.body.username}" is taken`})
        }
        else {
            (new User({ 'username': req.body.username, 'hash': bcrypt.hashSync(req.body.password,10) }))
                .save()
                .then(user => res.send(user))
                .catch((error) => {
                    console.log(error);
                    res.status(400).send({
                        message: "Bad request"
                    })
                })
        }
    })
})

router.get('/:userId', (req, res) => {
    User.findOne({ 'id': req.params.userId })
        .then(user => {res.send(user)})
        .catch((error) => {
            console.log(error);
            res.status(400).send({
                message: "User doesn't exist"
            })
        })
});


module.exports = router;