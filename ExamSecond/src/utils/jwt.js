const jwt = require('jsonwebtoken');
const util = require('util');

exports.signPromisify = util.promisify(jwt.sign);
exports.verifyPromisify = util.promisify(jwt.verify);