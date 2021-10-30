const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        minlength: [6,'min 6'],
    },
    keyword: {
        type: String,
        required: true,
        minlength: [6,'min 6'],
    },
    location: {
        type: String,
        required: true,
        minlength: [6,'min 10'],
    },
    dateOfCreation: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
        validate: [/^https?:\/\//i, 'invalid image url'],
    },
    description: {
        type: String,
        required: true,
        minlength: [8,'min 8'],
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


const Post = mongoose.model('Post', postSchema);

module.exports = Post;