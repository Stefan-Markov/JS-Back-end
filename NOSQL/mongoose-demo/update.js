const initDb = require('./dbConfig');
const Person = require('./models/Person');

initDb()
    .then(() => {
        // Person.findOne({_id: '600b198479ea983b9c27eb11'})
        //     .then(res => {
        //         console.log(res);
        //     })

        Person.updateOne({_id: '600b198479ea983b9c27eb11'}, {$set: {grade: 2}})
            .then(res => {
                console.log('Updated');
                console.log(res);
            })
    })


