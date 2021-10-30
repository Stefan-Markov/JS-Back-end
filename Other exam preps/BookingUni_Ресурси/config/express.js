const express = require('express');
const cookieParser = require('cookie-parser');
const hbs = require('express-handlebars');
const authMiddleware = require('../middlewares/auth');
const storage = require('../middlewares/storage');


module.exports = (app) => {
    app.engine('hbs', hbs({
        extname: 'hbs'
    }));
    app.set('view engine', 'hbs');

    app.use('/static', express.static('static'));
    app.use(express.urlencoded({extended: true}));
    app.use(cookieParser());
    app.use(authMiddleware());
    app.use(storage());

    app.user((req, res, next) => {


        next();
    });

}