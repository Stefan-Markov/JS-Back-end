const initDb = require('./dbConfig');
const Person = require('./models/Person');

initDb()
    .then(() => {
       Person.deleteOne({_id: '61534e62174fdaffaa8819b2'})
            .then(res => {
                console.log('deleted');
                console.log(res);
            })

    // Person.countDocuments()
    //     .then(console.log);
    })


