//In production, CORS is not needed and in fact not preferable

const express = require('express');
const app = express();
const cors = require('cors');
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
          cors: "*"
      });
app.use(express.json());
app.use(cors())

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

app.use('/posts', require('./posts/posts.controller')(sockets))

server.listen(3000, () => console.log("Server Connected"))