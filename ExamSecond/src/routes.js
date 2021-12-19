const router = require('express').Router();
const homeController = require('./controllers/homeController');
const authController = require('./controllers/authController');
const galleryController = require('./controllers/galleryController');


router.use(homeController);
router.use('/auth', authController);
router.use('/gallery',galleryController)



router.use('*', (req, res) => {
    res.render('404');
});

module.exports = router;