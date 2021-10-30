const router = require('express').Router();
const housingService = require('../services/housingService');
const {isAuth} = require('../middlewares/authMiddleware');
const {getErrorMessage} = require('../utils/errorMessage');

router.get('/', async (req, res) => {
    let housings = await housingService.getAll();

    res.render('housing', {housings});
});


router.get('/create', isAuth, (req, res) => {
    res.render('housing/create');
});

router.post('/create', isAuth, async (req, res) => {

    try {
        await housingService.create({...req.body, owner: req.user._id});
        res.redirect('/');
    } catch (errors) {

        res.locals.errors = Array.of(getErrorMessage(errors));
        res.render('housing/create');
    }

});

// function getErrorMessage(errors) {
//     // let errorNames = Object.keys(error.message);
//     // if (errorNames > 0) {
//     //     return error.errors[errorNames[0]];
//     // } else {
//     //     return error.message;
//     // }
//     return Object.keys(errors.errors).map(x => errors.errors[x].message);
// }

router.get('/:housingId/details', async (req, res) => {

    let housing = await housingService.getOne(req.params.housingId);
    let housingData = await housing.toObject();
    let tenants = housing.getTenants();
    let isOwner = housingData.owner == req.user?._id;
    let isRented = housing.tenants.some(x => x._id == req.user?._id);
    let isAvailable = housing.availablePieces > 0;
    res.render('housing/details', {...housingData, isOwner, tenants, isAvailable, isRented});
});

router.get('/:housingId/rent', isNotOwner, async (req, res) => {
    // let housing = await housingService.getOne(req.params.housingId);
    // housing.tenants.push(req.user._id);
    // housing.save();

    await housingService.addTenant(req.params.housingId, req.user._id);

    res.redirect(`/housing/${req.params.housingId}/details`)
});

router.get('/:housingId/delete', isOwner, async (req, res) => {

    await housingService.deleteById(req.params.housingId);
    res.redirect('/housing');
});

router.get('/:housingId/edit', isOwner, async (req, res) => {
    let housing = await housingService.getOne(req.params.housingId);

    res.render('housing/edit', {...housing.toObject()});

});

router.post('/:housingId/edit', isOwner, async (req, res) => {
    await housingService.updateOne(req.params.housingId, req.body);
    res.redirect(`/housing/${req.params.housingId}/details`);
});

async function isOwner(req, res, next) {

    let housing = await housingService.getOne(req.params.housingId);

    if (housing.owner.toString() === req.user._id) {
        next();
    } else {
        res.redirect('/housing');
    }
}

async function isNotOwner(req, res, next) {
    let housing = await housingService.getOne(req.params.housingId);
    if (housing.owner.toString() !== req.user._id) {
        next();
    } else {
        res.redirect('/housing');
    }
}

module.exports = router;