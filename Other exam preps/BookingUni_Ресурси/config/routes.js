const authController = require('../controllers/authController');
const homeController = require('../controllers/homeController');
module.exports = (app) => {
    app.use('/auth', authController);
    app.use('/', homeController);
}