const User = require('../models/User');
const jwt = require('../utils/jwt');
const SECRET = 'MY-SECRET-KEY';

exports.login = async function ({username, password}) {
    let user = await User.findOne({username});
    let isValid = await user.validatePassword(password);

    if (!user || !isValid) {
        throw new Error('Enter valid credentials.')
    }
    let payload = {
        _id: user._id,
        name: user.name,
        username: user.username
    };

    return await jwt.signPromisify(payload, SECRET);
}
exports.register = (userData) => User.create(userData);