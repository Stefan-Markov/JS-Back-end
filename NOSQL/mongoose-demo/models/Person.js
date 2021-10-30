const mongoose = require('mongoose');

const personSchema = new mongoose.Schema({
    name: String,
    age: Number,
    grade: {
        type: Number,
        required: false,
        min: [2, 'Grade cannot be lower than 2'],
        max: [6, 'Grade cannot be higher than 6, you got {VALUE}'] 
    },
    pet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pet'
    }
});

personSchema.methods.greet = function() {
    return `Hello! I am ${this.name} and I'm ${this.age} years old.`;
};

personSchema.virtual('isExcellent')
    .get(function() {
        return this.grade >= 5.5;
    });

personSchema.path('grade').validate(function() {
    return this.grade >= 2 && this.grade <= 6;
}, 'Grade should be in range [2,6] inclusive'); 

const Person = mongoose.model('Person', personSchema);

module.exports = Person;
