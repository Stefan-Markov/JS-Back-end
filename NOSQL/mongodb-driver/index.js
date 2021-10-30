const mongodb = require('mongodb');

const client = new mongodb.MongoClient('mongodb://localhost:27017');

client.connect()
    .then(() => {
        console.log('Connected');

        const db = client.db('mongotest');
        const collection = db.collection('people');

        return collection.find({}).toArray()
    })
    .then(people => {
        console.log(people);
    });