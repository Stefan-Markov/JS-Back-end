const initDb = require('./dbConfig');
const Person = require('./models/Person');
const Pet = require('./models/Pet');

initDb()

// Person.find()
//     .then(people => {
//         console.log(people);
//     });

async function getPeople() {
    await initDb()

    let people = await Person.find();

    people.forEach(x => console.log(x.greet() + ' - ' + x.isExcellent));
}

async function getPerson() {
    await initDb();

    let person = await Person.findOne();

    console.log(person);
}

async function getById(id) {
    await initDb();

    let person = await Person.findOne({_id: id})
        .populate('pet');

    console.log(person);
}


// getPeople();
// getPerson();
getById('6153680ba1422de17201585f');
