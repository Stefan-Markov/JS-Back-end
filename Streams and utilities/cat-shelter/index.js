const http = require('http');
const fs = require('fs');
const formidable = require('formidable');

const storageService = require('./services/storageService.js');

//let body = [];
// request.on('data', (chunk) => {
//   body.push(chunk);
// }).on('end', () => {
//   body = Buffer.concat(body).toString();
//   // at this point, `body` has the entire request body stored in it as a string
// });

const app = http.createServer((req, res) => {
    switch (req.url) {
        case '/':
            let content = fs.readFileSync('./views/home/index.html');
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });
            res.write(content);
            res.end();
            break;
        case '/styles/site.css':
            let css = fs.readFileSync('./styles/site.css');
            res.writeHead(200, {
                'Content-Type': 'text/css'
            });
            res.write(css);
            res.end();
            break;
        case '/js/script.js':
            let js = fs.readFileSync('./js/script.js');
            res.writeHead(200, {
                'Content-Type': 'text/javascript'
            });
            res.write(js);
            res.end();
            break;
        case '/cats/add-cat':
            if (req.method === 'GET') {
                res.writeHead(200, {
                    'Content-Type': 'text/html'
                });
                fs.readFile('./views/addCat.html', 'utf8', (err, result) => {
                    if (err) {
                        res.statusCode = 404;
                        return res.end();
                    }

                    let breeds = [
                        'Persian',
                        'Angora',
                        'UlichnaPrevyshodna',
                    ];

                    let mappedBreeds = breeds.map(x => `
                        <option value="${x}">${x}</option>
                    `);

                    result = result.replace('{{breeds}}', mappedBreeds);

                    res.write(result);
                    res.end();
                });
            } else if (req.method === 'POST') {
                let form = formidable.IncomingForm();

                form.parse(req, (err, fields, files) => {
                    storageService.saveCat(fields)
                        .then(() => {
                            console.log('end');
                            res.end();
                        })
                        .catch(err => {
                            console.log('err');
                            console.log(err);
                        })

                    res.writeHead(302, {
                        'Location': '/'
                    });

                    res.end();
                });

            }
            break;
        default:
            res.statusCode = 404;
            res.end();
            break;
    }
});

app.listen(5000);

console.log('App is listening on port 5000...');