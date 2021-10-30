const User = require("../models/User");
const jwt = require('../utils/jwt');
const SECRET = 'MY-SECRET-KEY';

exports.register = (userData) => User.create(userData);


exports.login = async function ({email, password}) {
    let user = await User.findOne({email});
    let isValid = await user.validatePassword(password);

    if (!user || !isValid) {
        throw new Error('Enter valid credentials.')
    }
    let payload = {
        _id: user._id,
        email: user.email
    };

    return await jwt.signPromisify(payload, SECRET);
}

exports.findById = (id) => User.findById(id).lean();

