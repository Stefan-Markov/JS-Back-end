const jwt = require('jsonwebtoken');

exports.auth = function (req, res, next) {
    let token = req.headers['x-authorization']

    if (token) {
        let decodedToken = jwt.verify(token, 'MOGYSHTSECRET')
        if (decodedToken) {
            req.user = decodedToken;

            next();
        } else {
            res.status(401).json('You are not authorized');
        }
    } else {
        next();
    }
};

exports.isAuth = function (req, res, next) {
    if (req.user) {
        next()
    } else {
        res.status(401).json({message: 'You are not authorized'});
    }
};

// exports.isGuest = function (req, res, next) {
//     if (!req.user) {
//         next();
//     } else {
//         res.redirect('/');
//     }
// };
