const jwt = require('jsonwebtoken');

const {SECRET} = require('../constants');

function auth(req, res, next) {

    let token = req?.cookies['jwt'];

    if (token) {
        jwt.verify(token, SECRET, (err, decodedToken) => {
            if (err) {
                throw err;
            }

            req.user = decodedToken;

            next();
        });
    } else {
        next();
    }
}

exports.auth = auth;