const url = require('url');
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');
const formidable = require('formidable');
const cats = require('../data/cats.json');
const breeds = require('../data/breeds.json');
const {v4: uuidv4} = require('uuid');

module.exports = (req, res) => {
    const pathname = url.parse(req.url).pathname;

    if (pathname === '/cats/add-cat' && req.method === 'GET') {
        const filePath = path.normalize(path.join('views', 'addCat.html'));
        fs.readFile(filePath, 'utf-8', (err, content) => {
            if (err) {
                console.log(err);
                res.writeHead(404, {
                    'Content-Type': 'text/plain'
                });
                res.write('Page Not Found!')
                res.end();
                return;
            }
            let catBreedPlaceholder = breeds.map((breed) => `<option value="${breed}">${breed}</option>`);
            let modifiedData = content.toString().replace('{{catBreeds}}', catBreedPlaceholder);

            res.writeHead(200, {
                'Content-Type': 'text/html'
            });

            res.write(modifiedData);
            res.end();
        });
    } else if (pathname === '/cats/add-cat' && req.method === 'POST') {
        const id = uuidv4();
        const form = formidable({multiples: true});

        form.parse(req, (err, fields, files) => {
            if (err) {
                throw err;
            }
            res.writeHead(200, {'Content-Type': 'application/json'});

            const name = files.upload.name;
            let readStream = '';
            let writeStream = '';

            if (name !== '') {
                readStream = fs.createReadStream(files.upload.path);
                writeStream = fs.createWriteStream(`./content/images/${files.upload.name}`);
                readStream.pipe(writeStream);
                readStream.on('end', function () {
                    fs.unlink(files.upload.path, err => {
                        if (err) throw err;
                        console.log('File deleted successfully!');
                    });
                });
            }

            let image = name;
            console.log(image);
            let newCat = {id, fields, files, image};

            const filePath = path.normalize(path.join('data', 'cats.json'))

            fs.readFile(filePath, (err, data) => {
                if (err) throw err;
                let catInfo = JSON.parse(data);
                catInfo.push(newCat);

                fs.writeFile(filePath, JSON.stringify(catInfo, null, 2), (err) => {
                    if (err) throw err;
                    console.log('Database updated!');
                });
            });

            res.writeHead(302, {
                Location: '/'
            });
            res.end();
        });
    } else if (pathname === '/cats/add-breed' && req.method === 'GET') {
        const filePath = path.normalize(path.join('views', 'addBreed.html'));
        fs.readFile(filePath, 'utf-8', (err, content) => {
            if (err) {
                console.log(err);
                res.writeHead(404, {
                    'Content-Type': 'text/plain'
                });
                res.write('Page Not Found!')
                res.end();
                return;
            }

            res.writeHead(200, {
                'Content-Type': 'text/html'
            });
            res.write(content);
            res.end();
        });
    } else if (pathname === '/cats/add-breed' && req.method === 'POST') {
        let breedName = [];
        let breed = '';

        if (req.method === 'POST') {
            let body = '';
            req.on('data', function (data) {
                body += data;
                // Too much POST data, kill the connection!
                // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
                if (body.length > 1e6)
                    req.connection.destroy();
            });

            req.on('end', function () {
                const post = querystring.parse(body);
                breed = post.breed;
                breedName.push(breed);
                console.log(breedName);
            });

            const filePath = path.normalize(path.join('data', 'breeds.json'))

            fs.readFile(filePath, (err, data) => {
                if (err) throw err;
                let breedInfo = JSON.parse(data);
                breedInfo.push(breed);
                console.log(breedInfo);
                fs.writeFile(filePath, JSON.stringify(breedInfo, null, 2), (err) => {
                    if (err) throw err;
                    console.log('Database updated!');
                })
            });

            res.writeHead(302, {
                Location: '/'
            });
            res.end();
        }
    } else if (pathname.includes('/cats-edit') && req.method === 'GET') {
        const filePath = path.normalize(path.join('views', 'editCat.html'));

        fs.readFile(filePath, 'utf-8', (err, content) => {
            const id = req.url.slice(11);
            const findCat = cats.filter(c => c.id === id);
            const currentCat = findCat[0];
            const catName = currentCat.fields.name;
            const description = currentCat.fields.description;
            const breed = currentCat.fields.breed;
            const image = currentCat.image;
            const catImage = `/content/images/${image}`;
            if (err) {
                console.log(err);
                res.writeHead(404, {
                    'Content-Type': 'text/plain'
                });
                res.write('Page Not Found!')
                res.end();
                return;
            }
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });
            let modifiedData = content.toString().replace('{{id}}', id);
            modifiedData = modifiedData.replace('{{name}}', catName);
            modifiedData = modifiedData.replace('{{description}}', description);
            modifiedData = modifiedData.replace('{{image}}', catImage);

            const breedsAsOptions = breeds.map(b => `<option value="${b}">${b}</option>`);
            modifiedData = modifiedData.replace('{{catBreeds}}', breedsAsOptions.join('/'));
            modifiedData = modifiedData.replace('{{breed}}', breed);
            res.write(modifiedData);
            res.end();
        });
    } else if (pathname.includes('/cats-edit') && req.method === 'POST') {
        const form = formidable({multiples: true});

        form.parse(req, (err, fields, files) => {
            if (err) {
                throw err;
            }
            res.writeHead(200, {'Content-Type': 'application/json'});

            const name = files.upload.name;
            let readStream = '';
            let writeStream = '';

            if (name !== '') {
                readStream = fs.createReadStream(files.upload.path);
                writeStream = fs.createWriteStream(`./content/images/${files.upload.name}`);
                readStream.pipe(writeStream);
                readStream.on('end', function () {
                    fs.unlink(files.upload.path, err => {
                        if (err) throw err;
                        console.log('File deleted successfully!');
                    });
                });
            }

            const filePath = path.normalize(path.join('data', 'cats.json'));

            fs.readFile(filePath, 'utf-8', (err, content) => {
                if (err) {
                    throw err;
                } else {
                    let currentCats = JSON.parse(content);
                    const id = req.url.slice(11);
                    const oldCat = currentCats.filter(c => c.id === id);
                    let oldImage = oldCat[0].image;
                    let newImage = files.upload.name;
                    // Check if image already exists and keep it if so, otherwise change
                    if (newImage === '') {
                        newImage = oldImage;
                    } else {
                        newImage = newImage;
                    }
                    const haveId = currentCats.some(c => c.id === id);
                    let newCat = {};

                    // Check if ID exists, if some create updated cat and keep the ID
                    if (haveId) {
                        newCat = {
                            id,
                            fields,
                            files,
                            image: newImage
                        };

                    }

                    // Loop through cats and remove old entry in order to replace it with the new one
                    for (let cat of currentCats) {
                        if (cat.id === id) {
                            let currentIndex = currentCats.indexOf(cat);
                            currentCats.splice(currentIndex, 1, newCat); //removing the old object and adding the new one
                        }
                    }

                    const result = JSON.stringify(currentCats, null, 2);
                    // Save result and redirect to the home page
                    fs.writeFile(filePath, result, 'utf-8', () => {
                        res.writeHead(302, {
                            Location: '/'
                        });
                        res.end();
                    });
                }
            });
        });
    } else if (pathname.includes('/cats-find-new-home') && req.method === 'GET') {
        const filePath = path.normalize(path.join('views', 'catShelter.html'));

        fs.readFile(filePath, 'utf-8', (err, content) => {
            const id = req.url.slice(20);
            console.log(id);
            const findCat = cats.filter(c => c.id === id);
            const currentCat = findCat[0];

            const catName = currentCat.fields.name;
            const description = currentCat.fields.description;
            const breed = currentCat.fields.breed;
            const image = currentCat.image;
            const catImage = `/content/images/${image}`;
            if (err) {
                console.log(err);
                res.writeHead(404, {
                    'Content-Type': 'text/plain'
                });
                res.write('Page Not Found!')
                res.end();
                return;
            }
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });
            let modifiedData = content.toString().replace('{{id}}', id);
            modifiedData = modifiedData.replace('{{name}}', catName);
            modifiedData = modifiedData.replace('{{description}}', description);
            modifiedData = modifiedData.replace('{{image}}', catImage);

            const breedsAsOptions = breeds.map(b => `<option value="${b}">${b}</option>`);
            modifiedData = modifiedData.replace('{{catBreeds}}', breedsAsOptions.join('/'));
            modifiedData = modifiedData.replace('{{breed}}', breed);
            res.write(modifiedData);
            res.end();
        });
    } else if (pathname.includes('/cats-find-new-home') && req.method === 'POST') {
        const filePath = path.normalize(path.join('data', 'cats.json'));
        fs.readFile(filePath, 'utf-8', (err, content) => {
            if (err) {
                throw err;
            } else {
                let currentCats = JSON.parse(content);
                const id = req.url.slice(20);
                const haveId = currentCats.some(c => c.id === id);

                // Check if ID exists, if some create updated cat and keep the ID
                if (haveId) {
                    // Loop through cats and remove old entry in order to delete it from db
                    for (let cat of currentCats) {
                        if (cat.id == id) {
                            let currentIndex = currentCats.indexOf(cat);
                            currentCats.splice(currentIndex, 1); //removing the old object
                        }
                    }
                }

                const result = JSON.stringify(currentCats, null, 2);
                // Save result and redirect to the home page
                fs.writeFile(filePath, result, 'utf-8', () => {
                    res.writeHead(302, {
                        Location: '/'
                    });
                    res.end();
                });
            }
        });
    } else if (pathname.includes('/search') && req.method === 'GET') {
        let urlObj = url.parse(req.url);
        let query = urlObj.query;
        let nameSearched = query.split('=')[1].toLowerCase();

        let matchedCats = cats.filter(c => c.fields.name.toLowerCase().includes(nameSearched));
        const filePath = path.normalize(path.join('views', 'home', 'index.html'));
        fs.readFile(filePath, 'utf-8', (err, content) => {
            if (err) {
                console.log(err);
                res.writeHead(404, {
                    'Content-Type': 'text/plain'
                });
                res.write('Page Not Found!')
                res.end();
                return;
            }

            let modifiedCats = matchedCats.map(cat => `<li>
        <img src="${`./content/images/${cat.image}`}" alt="${cat.fields.name}">
        <h3>${cat.fields.name}</h3>
        <p><span>Breed: </span>${cat.fields.breed}</p>
        <p><span>Description: </span>${cat.fields.description}</p>
        <ul class="buttons">
            <li class="btn edit"><a href="/cats-edit/${cat.id}">Change Info</a></li>
            <li class="btn delete"><a href="/cats-find-new-home/${cat.id}">New Home</a></li>
        </ul>
    </li>`);
            let modifiedData = content.toString().replace('{{cats}}', modifiedCats);
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });
            res.write(modifiedData);
            res.end();
        });
    } else {
        return true;
    }
}