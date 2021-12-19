const router = require('express').Router();
const galleryService = require('../service/galleryService')
const {isAuth} = require("../middlewares/authMiddleware");
const {getErrorMessage} = require("../utils/errorMessage");
const authService = require("../service/authService")

router.get("/all", async (req, res) => {

    let publications = await galleryService.findAll();
    res.render('gallery', {publications});
})

router.get("/create", isAuth, (req, res) => {

    res.render("gallery/create");
})

router.post("/create", isAuth, async (req, res) => {
    let author = req.user._id;
    let {title, technique, picture, certificate} = req.body;

    try {
        await galleryService.createPublication({title, technique, picture, certificate, author})
        res.redirect('/gallery/all');
    } catch (err) {
        res.locals.errors = Array.of(getErrorMessage(err));
        res.render('gallery/create');
    }
})

router.get("/details/:id", async (req, res) => {
    let publication = await galleryService.getOneById(req.params.id);
    let author = await authService.findById(publication.author);

    let owner = author._id.toString() === req.user?._id;
    let notOwner = author._id.toString() !== req.user?._id;

    let isShared = publication.usersShared.some(x => x._id == req.user?._id);

    res.render("gallery/details", {...publication, author, owner, notOwner, isShared})
});

router.get("/share/:id", isNotOwner, async (req, res) => {
    let publicationId = req.params.id;
    let userId = req.user._id;

    await galleryService.sharedPub(publicationId, userId);
    res.redirect(`/gallery/details/${req.params.id}`)
})

router.get("/edit/:id", isOwner, async (req, res) => {
    let publication = await galleryService.getOneById(req.params.id);

    res.render('gallery/edit', {...publication})
})

router.post("/edit/:id", isOwner, async (req, res) => {
    let {title, technique, picture, certificate} = req.body;
    let data = {title, technique, picture, certificate};

    try {
        await galleryService.findOneAndUpdate(req.params.id, {
            title, technique, picture, certificate
        })
        res.redirect(`/gallery/details/${req.params.id}`);
    } catch (err) {
        res.locals.errors = Array.of(getErrorMessage(err));
        res.render(`gallery/edit`, {...data});
    }
});

router.get('/remove/:id', isOwner, async (req, res) => {
    await galleryService.findByIdAndDelete(req.params.id);
    res.redirect('/');
});

router.get("/profile", isAuth, async (req, res) => {
    let user = await authService.findById(req.user._id);

    let publications = await galleryService.findAllByUserId(req.user._id);

    let titles = publications.map(x => x.title).join(', ');
    let sharedTitles = await galleryService.findAllShared(req.user._id);
    let shared = sharedTitles.map(x => x.title).join(', ');

    res.render('gallery/profile', {user, titles, shared});

})

async function isOwner(req, res, next) {
    let publication = await galleryService.getOneById(req.params.id);

    if (publication?.author.toString() === req.user?._id) {
        next();
    } else {
        res.redirect('/');
    }
}

async function isNotOwner(req, res, next) {
    let publication = await galleryService.getOneById(req.params.id);
    if (req.user) {
        if (publication?.author.toString() !== req.user?._id) {
            next();
        }
    } else {
        res.redirect('/');
    }
}

module.exports = router;