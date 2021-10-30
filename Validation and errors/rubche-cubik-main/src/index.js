const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');

const routes = require('./routes');
// const config = require('./config/config.json')[process.env.NODE_ENV];
const CONNECTION_STRING = "mongodb://localhost:27017/cubes";
const PORT = 5000;
const initDatabase = require('./config/database');
const {auth} = require('./middlewares/authMiddleware');
const {errorHandler} = require('./middlewares/errorHandlerMiddleware');

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(cookieParser())
app.use(auth);
require('./config/handlebars')(app);

app.use(express.static(path.resolve(__dirname, './public')));
app.use(routes);
app.use(errorHandler);

initDatabase(CONNECTION_STRING)
    .then(() => {
        app.listen(PORT, console.log.bind(console, `Application is running on http://localhost:${PORT}`));
    })
    .catch(err => {
        console.log('Application init failed: ', err);
    });