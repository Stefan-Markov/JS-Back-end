const mongoose = require('mongoose');
const bcrypt = require("bcrypt");

const postSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        minlength: [3, 'min 3 title'],
    },
    keyword: {
        type: String,
        required: true,
        minlength: [3, 'min 3 keyword'],
    },
    location: {
        type: String,
        required: true,
        minlength: [3, 'min 3 location'],
    },
    dateOfCreation: {
        type: String,
        required: true,
        validate: [/(\d{2}.)(\d{2}.)(\d{4})/, 'enter valid date of creation']
    },
    image: {
        type: String,
        required: true,
        validate: [/^https?:\/\//i, 'invalid image url'],
    },
    description: {
        type: String,
        required: true,
        minlength: [3, 'min 3 description'],
    },
    author: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    },
    votes: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'User',
        }
    ],
    rating: {
        type: Number,
        default: 0,
    }
});

postSchema.method('getUsers', function () {
    return this.votes.map(x => x.email).join(', ');
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;