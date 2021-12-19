const mongoose = require('mongoose');


const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: [6, 'cannot be with less then 6 characters'],
    },
    technique: {
        type: String,
        required: true,
        maxlength: [15, 'cannot be with more then 15 characters'],
    },
    picture: {
        type: String,
        required: [true, 'Image is required!'],
        validate: [/^https?:\/\//i, 'Image url is invalid']
    },
    certificate: {
        type: String,
        enum: ['yes', 'no'],
        required: true
    },
    author: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    },
    usersShared: [{
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }],

});

const Publication = mongoose.model('Publication', postSchema);

module.exports = Publication;