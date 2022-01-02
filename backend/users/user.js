const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    hash: {
        type: String,
        required: true
    },
    admin: {
        type: Boolean
    }
})

UserSchema.set('toJSON',{
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.hash;
        delete ret.admin;
    }
})

const User = mongoose.model('User',UserSchema)

module.exports = User