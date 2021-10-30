const express = require('express');
const fs = require('fs/promises');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const uniqid = require('uniqid');
const handlebars = require('express-handlebars');

const authService = require('./services/authService');
const {auth} = require('./middlewares/authMiddleware');
const {SECRET} = require('./constants');
const app = express();


app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: ['aloiasdmflkasdlkfjelnmzxckj', 'aloiasasdsdlkfjelnmzxckj', 'aloiasdmflkasdldazxckj'],
}));
app.engine('hbs', handlebars({
    extname: 'hbs'
}));
app.set('view engine', 'hbs');

app.use(express.static('./public'));
app.use(auth);

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/custom-cookie', (req, res) => {
    if (!req.headers.cookie) {
        res.header({
            'content-type': 'text/html',
            'Set-Cookie': 'test-cookie=test-value; httpOnly;'
        });
    }

    console.log(req.headers.cookie);

    fs.readFile('./views/index.hbs', {encoding: 'utf-8'})
        .then(htmlResult => {
            res.send(htmlResult);
        })
});

app.get('/cookie', (req, res) => {
    res.cookie('cookie-name2', 'some-value2', {
        httpOnly: true
    });

    console.log(req.cookies);

    fs.readFile('./views/index.hbs', {encoding: 'utf-8'})
        .then(htmlResult => {
            res.send(htmlResult);
        })
});

app.get('/set-session/:name', (req, res) => {
    req.session.user = req.params.name;

    res.send('Set Session');
});

app.get('/get-session', (req, res) => {
    console.log(req.session);

    res.send('Get Session - ' + req.session.user);
});

app.get('/bcrypt', (req, res) => {
    let password = 'azsymgotin';
    let saltRounds = 9;

    bcrypt.genSalt(saltRounds)
        .then(salt => {
            return bcrypt.hash(password, salt);
        })
        .then(hash => {
            console.log(hash);
            res.send(hash);
        })
});

app.get('/bcrypt/verify/:password', (req, res) => {
    let hashedPassword = '$2b$09$1y6chlJoThf5sYj2IShy6.VbnJ7Xyh7v42phr.DANeG6ZnSwCfeqC';

    bcrypt.compare(req.params.password, hashedPassword)
        .then(result => {
            res.send(result)
        });
});

app.get('/token/create/:password', (req, res) => {
    let payload = {
        id: uniqid(),
        password: req.params.password,
    };
    let options = {expiresIn: '10s'};

    let token = jwt.sign(payload, SECRET, options);

    res.cookie('jwt', token);

    res.send(token);
});

app.get('/token/verify', (req, res) => {
    let token = req.cookies['jwt'];

    jwt.verify(token, SECRET, (err, payload) => {
        if (err) {
            return res.status(400).send(err);
        }

        res.json(payload);
    });
});

app.get('/register', (req, res) => {
    res.render('register');
});


app.post('/register', async (req, res) => {
    let {username, password} = req.body;

    try {
        await authService.register(username, password);

        res.redirect('/login');
    } catch (error) {
        return res.status(400).send(error);
    }
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', async (req, res) => {
    let {username, password} = req.body;

    try {
        let isValid = await authService.login(username, password);

        if (isValid) {
            let user = await authService.getUser(username);

            jwt.sign({id: user.id, username: user.username}, SECRET, {expiresIn: '1d'}, (err, token) => {
                if (err) {
                    return res.status(400).send(err);
                }

                res.cookie('jwt', token);

                res.redirect('/');
            });

        } else {
            res.status(401).send('Cannot login');
        }
    } catch (error) {
        res.status(401).send(error.message);
    }
});

app.get('/profile', (req, res) => {
    if (!req.user) {
        return res.status(401).send('You are not authorized to view this page');
    }

    res.render('profile', req.user);
});

app.listen(3000, console.log.bind(console, 'Server is listening on port 3000...'));
