const mongoose = require('mongoose');
const {hash} = require("bcrypt");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
});
// userSchema.pre('save', function (next) {
//     return bCrypt.hash(this.password, 10)
//         .then(function (hash) {
//             this.password = hash;
//
//             return next();
//         })
// });

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