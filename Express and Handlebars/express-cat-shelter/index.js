const express = require('express');
const path = require('path');
const fs = require('fs');
const handlebars = require('express-handlebars');

const catController = require('./controllers/catController.js');
const requestLogger = require('./middlewares/requestLoggerMIddleware.js');

const app = express();

app.engine('hbs', handlebars({
    extname: 'hbs',
}));
app.set('view engine', 'hbs');

app.use(express.static('./public'));
// app.use(requestLogger); // application level
// app.use('/cats', requestLogger); // route level

// app.use('/cats', requestLogger, catController); // controller level
app.use('/cats', catController);

app.get('/', (req, res) => {
    // Custom HTML response
    // let absolutePath = path.join(__dirname, '/views/home/index.html')
    // let absolutePath = path.resolve(__dirname, './views/home/index.html')

    // res.sendFile(absolutePath);

    // render with handlebars
    res.render('home');
});

app.get('/add-breed', (req, res) => {
    res.render('addBreed');
});

app.get('/add-cat/:catName?', (req, res) => {
    let breeds = [
        {name: 'Persian'},
        {name: 'Angora'},
        {name: 'UlichnaPrevyzhodna'},
    ];

    res.render('addCat', {
        title: '<h1>Modified add cat</h1>',
        name: req.params.catName,
        breeds
    });
});

app.get('/download', (req, res) => {
    // res.header({
    // 'Content-Disposition': 'attachment; filename="cute-cat.jpg"'
    // });

    // let imageStream = fs.createReadStream('./images/cute-cat.jpg');

    // imageStream.pipe(res);

    res.download('./images/cute-cat.jpg');
});

app.get('/send-file', (req, res) => {
    res.sendFile('./images/cute-cat.jpg', {
        root: __dirname
    });
});

app.get('/data', (req, res) => {
    res.json({name: 'Navcho', age: 6});
});

app.get('/add*', (req, res) => {
    res.write('Add something else');
    res.end();
});

app.get(/.*cat.*/i, (req, res) => {
    res.write('Cat Detected!!!');
    res.end();
})

app.listen(5000, () => console.log('Server is running on port 5000...'));
