const {Schema, model} = require('mongoose');

const schema = new Schema({
    name: {type: String, required: true},
    city: {type: String, required: true},
    imageUrl: {type: String, required: true},
    rooms: {type: Number, required: true, min: 1, max: 100},
    bookedBy:[{type:Schema.Types.ObjectId,ref: 'User'}],
    owner:{type:Schema.Types.ObjectId,ref: 'User'}


});

module.exports = model(('Hotel', schema));