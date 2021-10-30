const router = require('express').Router();
const housingService = require('../services/housingService')

router.get('/', async (req, res) => {
    let housings = await housingService.getTop3();

    res.render('home', {housings});
});

router.get('/search', async (req, res) => {
    let housings = await housingService.getSearch(req.query.text);
    res.render('housing/search', {housings})
});


module.exports = router;
