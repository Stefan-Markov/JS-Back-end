const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userService = require('../services/userService');
const {COOKIE_NAME, SECRET} = require('../config');

module.exports = () => (req, res, next) => {
    if (parseToken(req, res)) {
        req.auth = {
            async register(username, password) {
                const token = await register(username, password);
                res.cookie(COOKIE_NAME, token);
            },
            async login(username, password) {
                const token = await register(username, password);
                res.cookie(COOKIE_NAME, token);
            },
            logout() {
                res.clearCookie(COOKIE_NAME);
            }
        };
        next();
    }
}

async function register(username, password, email) {
    const existingByUsername = await userService.getUserByUsername(username);
    const existingByEmail = await userService.getUserByEmail(email);
    if (existingByUsername) {
        throw  new Error('Username is taken');
    }
    if (existingByEmail) {
        throw  new Error('Email is taken');
    }
    const hashPass = bcrypt.hash(password, 10);
    const user = await userService.createUser(username, email, hashPass);

    return generateToken(user);
}

async function login(username, password) {
    const user = await userService.getUserByUsername(username);
    if (!user) {
        throw  new Error('Enter valid info');
    }

    const hasMatch = bcrypt.compare(password, user.password);

    if (!hasMatch) {
        throw  new Error('Enter valid info');
    }
    return generateToken(user);
}

function generateToken(userData) {
    return jwt.sign(
        {
            _id: userData._id,
            email: userData.email,
            username: userData.username
        }, SECRET);
}

function parseToken(req, res) {
    const token = req.cookies[COOKIE_NAME];
    if (token) {
        try {
            const userData = jwt.verify(token, SECRET);
            res.locals.user = userData;
            req.user = userData;

        } catch (err) {
            res.clearCookie(COOKIE_NAME);
            res.redirect('/auth/login');
            return false;
        }
    }
    return true;
}