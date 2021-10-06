const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    postedBy: {
        type: String
    }
})

PostSchema.set('toJSON',{
    versionKey: false
})

const Post = mongoose.model('Post',PostSchema)

module.exports = Post