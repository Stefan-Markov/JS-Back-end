const mongoose = require('mongoose');
const DB_CONNECTION_STRING = 'mongodb://localhost:27017/exam-db-retake';

exports.initDB = function () {
    return mongoose.connect(DB_CONNECTION_STRING);
}

