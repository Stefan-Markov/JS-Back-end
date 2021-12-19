const router = require('express').Router();
const postService = require("../services/postService");
const authService = require("../services/authService");
const {isAuth} = require("../middlewares/authMiddleware");
const {getErrorMessage} = require("../utils/errorMessage");

router.get('/create', isAuth, (req, res) => {
    let data = authService.userData(req, res);
    res.render('post/create', {...data});
});

router.post('/create', isAuth, async (req, res) => {

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

    let data = authService.userData(req, res);
    let posts = await postService.findAll();

    res.render('post/all-posts', {posts, ...data});
});

router.get('/details/:postId', async (req, res) => {
    let post = await postService.getOneById(req.params.postId);
    // let data = authService.userData(req, res);
    let email = req.user.email;

    let userVoted = await postService.findByIdUsersVoted(req.params.postId);
    // let users = userVoted.votes.map(x => x.email).join(', ');
    let users = userVoted.getUsers();

    let votes = post.votes;
    let isVoted = votes.some(x => x._id == req.user?._id);

    let userOwner = await authService.findById(post.author);
    let firstName = userOwner.firstName;
    let lastName = userOwner.lastName;

    let owner = post.author._id.toString() === req.user?._id;
    let notOwner = post.author._id.toString() !== req.user?._id;

    res.render('post/details', {...post, firstName, lastName, owner, notOwner, isVoted, users,email});
});

router.get('/voteup/:id', isAuth, async (req, res) => {

    let postId = req.params.id;
    let userId = req.user._id;
    await postService.voteUp(postId, userId);
    res.redirect(`/post/details/${postId}`);
});

router.get('/votedown/:id', isAuth, async (req, res) => {

    let postId = req.params.id;
    let userId = req.user._id;
    await postService.voteDown(postId, userId);
    res.redirect(`/post/details/${postId}`);
});

router.get('/edit/:postId', isOwner, async (req, res) => {
    let post = await postService.getOneById(req.params.postId);

    // let data = authService.userData(req, res);
    let email = req.user.email;
    res.render('post/edit', {...post,email});
});

router.post('/edit/:postId', isOwner, async (req, res) => {
    let {title, keyword, location, dateOfCreation, image, description} = req.body;
    let data = {title, keyword, location, dateOfCreation, image, description};
    try {
        await postService.findByIdAndUpdate(req.params.postId, {
            title,
            keyword,
            location,
            dateOfCreation,
            image,
            description
        });

        res.redirect(`/post/details/${req.params.postId}`);
    } catch (err) {
        res.locals.errors = Array.of(getErrorMessage(err));
        res.render(`post/edit`, {...data});
    }
});

router.get('/remove/:postId', isOwner, async (req, res) => {
    await postService.findByIdAndDelete(req.params.postId);
    res.redirect('/');
});

router.get('/my-post/:userId', isAuth, async (req, res) => {
    let data = authService.userData(req, res);

    let posts = await postService.findAllByuserId(req.params.userId);

    res.render('post/my-posts', {...data, posts});
});


async function isOwner(req, res, next) {
    let post = await postService.getOneById(req.params.postId);
    if (post?.author._id.toString() === req.user?._id) {
        next();
    } else {
        res.redirect('/');
    }
}

async function isNotOwner(req, res, next) {
    let post = await postService.getOneById(req.params.postId);
    if (post.author._id.toString() !== req.user?._id) {
        next();
    } else {
        res.redirect('/');
    }
}

module.exports = router;