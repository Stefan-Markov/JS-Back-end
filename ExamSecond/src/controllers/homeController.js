const router = require('express').Router();
const  galleryService = require('../service/galleryService')

router.get('/', async (req, res) => {

    let publications = await galleryService.findAll();


    res.render('home/home', {publications});
})


module.exports = router;