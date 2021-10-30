const router = require('express').Router();


router.get('/', (req, res) => {
    let email = req.user?.email;
    let _id = req.user?._id;
    res.render('home/home', {email, _id});
})


module.exports = router;