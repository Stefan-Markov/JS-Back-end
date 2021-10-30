const router = require('express').Router();

router.get('/',async (req, res) => {
    const hotels = await req.storage.getAllHotels();
    res.render('home/home',{hotels});
})

module.exports = router;