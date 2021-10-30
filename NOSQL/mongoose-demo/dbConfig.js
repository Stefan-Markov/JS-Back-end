const mongoose = require('mongoose');

const connectionString = 'mongodb://localhost:27017/mongotest';

const initDb = () => mongoose.connect(connectionString);

module.exports = initDb;