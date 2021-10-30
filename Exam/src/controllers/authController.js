const router = require('express').Router();
const authService = require('../services/authService');
const {isGuest, isAuth} = require("../middlewares/authMiddleware");
const {getErrorMessage} = require("../utils/errorMessage");
const TOKEN = 'token';


router.get('/register', isGuest, (req, res) => {
    res.render('auth/register');
});

router.get('/login', isGuest, (req, res) => {
    res.render('auth/login');
});

router.post('/login', isGuest, async (req, res) => {
    const {email, password} = req.body;

    if (!email || !password) {
        res.locals.erros = 'Invalid info';
        return res.render('auth/login');
    }

    try {

        let token = await authService.login({email, password});
        res.cookie(TOKEN, token);
        res.redirect('/');
    } catch (errors) {
        console.log(errors)
        res.locals.errors = Array.of(getErrorMessage(errors));
        return res.render('auth/login');
    }
})

router.post('/register', isGuest, async (req, res) => {
    const {firstName, lastName, email, password, repeatPassword} = req.body;

    if (password !== repeatPassword) {
        res.locals.errors = ['Password dont match'];
        return res.render('auth/register');
    }

    try {
        await authService.register({firstName, lastName, email, password});

        // let token = await authService.login({email, password});
        // res.cookie(TOKEN, token);
        res.redirect('/');
    } catch (errors) {
        res.locals.errors = [getErrorMessage(errors)];
        res.render('auth/register');
    }
});

router.get('/logout', isAuth, (req, res) => {
    res.clearCookie(TOKEN);
    res.redirect('/');
});


module.exports = router;
