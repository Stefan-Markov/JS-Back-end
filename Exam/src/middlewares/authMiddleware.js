const token = 'token';
const jwt = require('../utils/jwt');
const SECRET = 'MY-SECRET-KEY';
// exports.auth = function (req, res, next) {
//     let jwtToken = req.cookies[token];
//
//     if (jwtToken) {
//         jwt.verifyPromisify(token, SECRET)
//             .then(decodedToken => {
//                 req.user = decodedToken;
//                 next();
//             }).catch(err => {
//                 console.log('error login ' + err.message);
//             res.clearCookie(token);
//             // res.status(401).render('404');
//             res.redirect('/auth/login');
//         });
//     } else {
//         next();
//     }
// };
//
exports.isAuth = function (req, res, next) {
    if (req.user) {
        next();
    } else {
        res.redirect('/auth/login');
    }
};

exports.isGuest = function (req, res, next) {
    if (!req.user) {
        next();
    } else {
        res.redirect('/');
    }
};

exports.auth = function (req, res, next) {
    let token = req.cookies['token'];

    if (!token) {
        return next();
    }

    jwt.verifyPromisify(token, SECRET).then(decodedToken => {
        req.user = decodedToken;
        res.locals.user = decodedToken;
        next();
    }).catch(err => {
        console.log('error login ' + err.message);
        res.clearCookie(token);
        // res.status(401).render('404');
        res.redirect('/auth/login');
    });
};



