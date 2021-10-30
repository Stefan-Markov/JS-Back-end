const requestLogger = (req, res, next) => {
    console.log(req.path);

    next();
};

module.exports = requestLogger;