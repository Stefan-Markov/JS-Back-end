const initDb = require('./dbConfig');
const Person = require('./models/Person');

initDb()
    .then(() => {
        // Native mongodb query
        Person.find({$or: [
            {name: 'Kalinka'},
            {age: {$gte: 30}}
        ]})
            .then(res => {
                console.log(res);
            })

        // Mongoose query
        Person
            .where({name: 'Kalinka'})
            .or('age').gte(30)
            .then(res => {
                console.log(res);
            })
    })


