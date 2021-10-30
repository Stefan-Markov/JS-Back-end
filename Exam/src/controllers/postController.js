const router = require('express').Router();
const postService = require("../services/postService");
const authService = require("../services/authService");
const {isAuth} = require("../middlewares/authMiddleware");
const {getErrorMessage} = require("../utils/errorMessage");

router.get('/create', (req, res) => {

    res.render('post/create');
});

router.post('/create', async (req, res) => {

    let author = req.user._id;
    let {title, keyword, location, date, image, description} = req.body;
    try {
        await postService.create({title, keyword, location, dateOfCreation: date, image, description, author});
        res.redirect('/post/all');
    } catch (err) {
        res.locals.errors = Array.of(getErrorMessage(err));
        res.render('post/create');
    }

});

router.get('/all', async (req, res) => {
    let posts = await postService.findAll();

    res.render('post/all-posts', {posts});
});

router.get('/details/:postId', async (req, res) => {

    let post = await postService.getOneById(req.params.postId);

    let user = await authService.findById(req.user?._id);

    let firstName;
    let lastName;
    if (req.user) {
        firstName = user.firstName;
        lastName = user.lastName;
    }

    let owner = post.author.toString() === req.user?._id;
    let notOwner = post.author.toString() !== req.user?._id;

    res.render('post/details', {...post, firstName, lastName, owner, notOwner});
});

router.get('/edit/:postId', isOwner, async (req, res) => {
    let post = await postService.getOneById(req.params.postId);
    res.render('post/edit', {...post});
});

router.get('/edit/:postId', isOwner, async (req, res) => {
    let {title, keyword, location, dateOfCreation, image, description} = req.body;

    await postService.findByIdAndUpdate(req.params.postId, {
        title,
        keyword,
        location,
        dateOfCreation,
        image,
        description
    });

    res.redirect(`/post/details/${req.params.postId}`);

});

router.get('/remove/:postId', isOwner, async (req, res) => {
    await postService.findByIdAndDelete(req.params.postId);
    res.redirect('/');
});

router.get('/my-post/:userId', isAuth, async (req, res) => {

    let firstName = req.user.firstName;
    let lastName = req.user.lastName;
    let posts = await postService.findAllByuserId(req.params.userId);

    res.render('post/my-posts', {posts, firstName, lastName});
});


async function isOwner(req, res, next) {

    let post = await postService.getOneById(req.params.postId);

    if (post.author.toString() === req.user._id) {
        next();
    } else {
        res.redirect('/');
    }
}

async function isNotOwner(req, res, next) {
    let post = await postService.getOneById(req.params.postId);

    if (post.author.toString() !== req.user._id) {
        next();
    } else {
        res.redirect('/');
    }
}

module.exports = router;