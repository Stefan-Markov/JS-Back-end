const initDb = require('./dbConfig');
const Pet = require('./models/Pet');
const Person = require('./models/Person');

initDb()
    .then(() => {
        // First way to create db document
        // let person = new Person({
        //     name: 'Kalinka',
        //     age: 28,
        // });


        // person.save()
        //     .then(() => {
        //         console.log('Person saved!');
        //     })

        // Second way to create db document
        // Person.create({
        //     name: 'Dragan',
        //     age: 30,
        //     grade: 6.6,
        // })
        //     .then(person => {
        //         console.log('Person created');
        //         console.log(person);
        //     });

        Pet.create({
            name: 'Navcho',
            species: 'Cat',
        })
            .then(cat => {
                console.log(cat);
                let person = new Person({
                    name: 'Ivaylo Papazov',
                    age: 34,
                    grade: 2,
                });

                person.pet = cat;

                return person.save();
            })
            .then(res => {
                console.log(res);
            })
    });