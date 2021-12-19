const mongoose = require('mongoose');
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true,
        minlength: [4, 'cannot be with less then 4 characters'],
    },
    password: {
        type: String,
        required: true,
        minlength: [3, 'cannot be with less then 3 characters'],
    },
    address: {
        type: String,
        required: [true, 'Address is required'],
        minlength: [1, 'cannot be with less then 1 characters'],
        maxlength: [20, 'cannot be with more then 20 characters'],
    },

});


userSchema.pre('save', function (next) {
    return bcrypt.hash(this.password, 10)
        .then(hash => {
            this.password = hash;
            next();
        });
});


userSchema.method('validatePassword', function (password) {
    return bcrypt.compare(password, this.password);
});


const User = mongoose.model('User', userSchema);

module.exports = User;