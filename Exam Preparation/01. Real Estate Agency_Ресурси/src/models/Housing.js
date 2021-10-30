const mongoose = require('mongoose');

const housingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['Apartment', 'Villa', 'House'],
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: [true, 'Image is required!'],
        validate: [/^https?:\/\//i, 'Image url is invalid']
    },
    description: {
        type: String,
        required: true
    },
    availablePieces: {
        type: Number,
        required: true,
    },
    tenants: [{
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }],
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    },
}, {
    timestamps: true
});

housingSchema.method('getTenants', function () {
    return this.tenants.map(x => x.name).join(', ');
});

let housing = mongoose.model('Housing', housingSchema);

module.exports = housing;