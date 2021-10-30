const express = require('express');
const router = express.Router();
const requestLogger = require('../middlewares/requestLoggerMIddleware.js');

router.get('/navcho', (req, res) => {
    res.write('<h1>Navcho Rulez!</h1>')
    res.end();
});

router.get('/:catName', requestLogger, (req, res) => {
    if (req.params.catName == 'navuhodonosor') {
        return res.redirect('/cats/navcho');
    }
    
    res.header({
        'Content-Type': 'text/html'
    });
    
    res.write(`<h1>Cat Profile</h1><h2>${req.params.catName}</h2>`);
    res.end();
});

module.exports = router;
