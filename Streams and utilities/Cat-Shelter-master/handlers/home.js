const url = require('url');
const fs = require('fs');
const path = require('path');
const cats = require('../data/cats.json');

module.exports = (req, res) => {
    const newUrl = req.url;
    const pathname = url.parse(newUrl).pathname;

    if (pathname === '/' && req.method === 'GET') {
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

            let modifiedCats = cats.map(cat => `<li>
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
        })
    } else {
        return true;
    }
}