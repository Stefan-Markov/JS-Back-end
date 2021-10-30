import express from 'express';
import handlebars from 'express-handlebars';
import fs from 'fs';

//**************************** Setting up data import **********
import {createRequire} from 'module'; // Bring in the ability to create the 'require' method
const require = createRequire(import.meta.url); // construct the require method

const catsJson = require('./data/cats.json');
const breedsJson = require('./data/breeds.json');

//**************************** Port and app init ***************

const PORT = 3000;
const app = express();

//**************************** Handlebars setup ****************

app.engine('hbs', handlebars({
        extname: 'hbs',
    })
);
app.set('view engine', 'hbs');

//**************************** Middleware **********************

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//**************************** Home ****************************

app.get('/', (req, res) => {
    const isHome = true;
    const cats = catsJson.cats;
    res.render('home', {
        layout: 'main',
        isHome,
        cats,
    });
});

//**************************** Add cat *************************

app.get('/add-cat', (req, res) => {
    const breedsArr = breedsJson.breeds;
    console.log(breedsArr);
    res.render('addCat', {
        layout: 'main',
        breedsArr,
    });
});

//**************************** Add breed ************************

//GET
app.get('/add-breed', (req, res) => {
    res.render('addBreed', {
        layout: 'main',
    });
});

//POST
app.post('/add-breed', (req, res) => {
    const breedToAdd = req.body.breed;
    if (!breedsJson.breeds.includes(breedToAdd)) {
        breedsJson.breeds.push(breedToAdd);
        fs.writeFile('./data/breeds.json', JSON.stringify(breedsJson), (err) => {
            if (err) throw err;
        });
    }
    res.redirect('/');
});

app.listen(PORT, () => {
    console.info(`Listening on port: ${PORT}...`);
});
