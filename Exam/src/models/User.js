const mongoose = require('mongoose');
const {hash} = require("bcrypt");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: [3, 'cannot be with less then 3 characters'],
    },
    lastName: {
        type: String,
        required: true,
        minlength: [5, 'cannot be with less then 5 characters'],
    },
    email: {
        type: String,
        required: true,
        match: [/.+@.+\..+/,'Enter valid email'],
    },
    password: {
        type: String,
        required: true,
        minlength: [4, 'cannot be with less then 4 characters'],
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