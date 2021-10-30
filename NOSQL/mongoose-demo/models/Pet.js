const mongoose = require('mongoose');

let petSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 10,
    },
    species: {
        type: String,
        required: true,
    }
});

let Pet = mongoose.model('Pet', petSchema);

module.exports = Pet;
