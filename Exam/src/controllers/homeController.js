const authService = require("../services/authService");
const router = require('express').Router();


router.get('/', (req, res) => {
    let data = authService.userData(req, res);
    res.render('home/home', {...data});
})


module.exports = router;