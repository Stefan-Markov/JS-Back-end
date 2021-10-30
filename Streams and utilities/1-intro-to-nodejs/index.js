const http = require('http');
const fs = require('fs');

let app = http.createServer((req, res) => {
    switch (req.url) {
        case '/':
            res.write('<h1>Homepage</h1> <a href="/cats">cats</a>');
            res.end();
            break;
        case '/cats':
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });

            let result = fs.readFileSync('./views/cats.html');

            res.write(result);
            res.end();
            break;
        case '/img/cat.jpg':
            res.writeHead(200, {
                'Content-Type': 'image/jpeg'
            });

            let catStream = fs.createReadStream('./img/cat.jpg');

            // catStream.on('data', (chunk) => {
            //     res.write(chunk);
            // });

            // catStream.on('end', () => {
            //     res.end();
            // });

            catStream.pipe(res);

            break;
        default:
            res.write('Error page 404');
            res.end();
            break;
    }
});

app.listen(5000);

console.log('Node.js server running on port 5000...');
