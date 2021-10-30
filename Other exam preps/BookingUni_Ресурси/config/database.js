const mongoose = require('mongoose');
const config = require('./index');

module.exports = (app) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(config.CONNECTING_DB_STRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        const db = mongoose.connection;
        db.on('error', (err) => {
            console.log('Error in db: ' + err.message)
            reject(err);
        });

        db.once('open', function () {
            console.log("DB up.")
            resolve();
        });
    })
}

