const User = require("../models/User");
const jwt = require('../utils/jwt');
const SECRET = 'MY-SECRET-KEY';

exports.register = (userData) => User.create(userData);


exports.login = async function ({email, password}) {
    let user = await User.findOne({email});
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

exports.userData =  function (req, res) {
    if (req.user) {
        let {_id, email} =  req.user;
        return {_id, email};
    }
    return null;
}

exports.findById = (id) => User.findById(id).lean();

