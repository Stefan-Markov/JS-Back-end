const router = require('express').Router();
const {body, validationResult} = require('express-validator');
const {isGuest, isUser} = require('../middlewares/guards');

router.get('/register', isGuest(), (req, res) => {
    res.render('register');
});

router.post('/register', isGuest(),
    body('email', 'Invalid email.').isEmail(),
    body('username').isLength({min: 3}).withMessage('Min 3 chars.'),
    body('password').isLength({min: 3}).withMessage('Password must be at least 3 chars')
        .bail().matches(/[a-zA-Z0-9]/).withMessage('.....'),
    body('repeatPassword').custom((value, {req}) => {
        if (value !== req.body.password) {
            throw new Error('Pass don\'t match');
        }
        return true;
    }),
    async (req, res) => {
        const {errors} = validationResult(req);
        try {
            if (errors.length > 0) {
                const message = errors.map(e => e.msg).join('\n');
                throw new Error(message);
            }
            await req.auth.register(req.body.username, req.body.email, req.body.password);
            res.redirect('/');
        } catch (err) {
            const ctx = {
                errors: err.message.split('\n'),
                userData: {
                    email: req.body.email,
                    username: req.body.username
                }
            }

            res.render('register', ctx);
        }

    });

router.get('/login', isGuest(), (req, res) => {
    res.render('login');
});
router.post('/login', isGuest(), async (req, res) => {
    try {
        await req.auth.login(req.body.username, req.body.password);

        res.redirect('/');
    } catch (err) {
        const ctx = {
            errors: [err.message],
            userData: {
                username: req.body.username
            },
        };
        res.render('login', ctx);
    }
});

router.get('/logout', isUser(), (req, res) => {
    req.auth.logout();
    res.redirect('/');
})

module.exports = router;