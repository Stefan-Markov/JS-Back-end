const hotel = require('../services/hotelService');


module.exports = (req, res, next) => {

    req.storage = {
        ...hotel
    };
    next();
}
