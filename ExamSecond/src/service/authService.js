
const jwt = require('../utils/jwt');
const SECRET = 'MY-SECRET-KEY';
const User = require("../models/User");

exports.register = (userData) => User.create(userData);


exports.login = async function ({username, password}) {
    let user = await User.findOne({username});
    if (!user) {
        throw new Error('Enter valid credentials.')
    }
    let isValid = await user.validatePassword(password);

    if (!isValid) {
        throw new Error('Enter valid credentials.')
    }
    let payload = {
        _id: user._id,
        email: user.email
    };

    return await jwt.signPromisify(payload, SECRET);
}

exports.findById = (id) => User.findById(id).lean();

