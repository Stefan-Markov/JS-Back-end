const bcrypt = require('bcrypt');
const uniqid = require('uniqid');
const users = [
    {
        id: 'oamrneuwkuef8kgj',
        username: 'ivo',
        password: '$2b$09$CLqpiNsXrXd60aeB3Oyqh.BYkihn2WrsJFNQ8jWoqA85oO9teDEFi'
    }
];

function register(username, password) {
    if (users.some(x => x.username === username)) {
        throw {message: 'user already registered'};
    }

    bcrypt.hash(password, 9)
        .then(hash => {
            let user = {id: uniqid(), username, password: hash};

            users.push(user);

            return user;
        });
}

function login(username, password) {
    let user = users.find(x => x.username === username);

    if (!user) {
        throw {message: 'Cannot find username or password'};
    }

    return bcrypt.compare(password, user.password)
}

function getUser(username) {
    return users.find(x => x.username === username);
}

const authService = {
    register,
    login,
    getUser,
};

module.exports = authService;