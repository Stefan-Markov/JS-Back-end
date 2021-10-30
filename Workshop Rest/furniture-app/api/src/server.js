const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const routes = require('./routes');
const { auth } = require('./middlewares/authMiddleware');
const app = express();

mongoose.connect('mongodb://localhost:27017/furniture')
    .then(() => {
        console.log('DB Connected')
    });

mongoose.connection.on('error', (error) => {
    console.log('DB Error: ', error)
});

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());
app.use(auth);

app.get('/', (req, res) => {
    res.json({text: 'It\'s working'})
});

app.use(routes);
app.use((err, req, res, next) => {
    res.status(err.statusCode || 400).json({message: 'error'});
});
app.listen(3030, () => console.log('App is running on port 3030'));
