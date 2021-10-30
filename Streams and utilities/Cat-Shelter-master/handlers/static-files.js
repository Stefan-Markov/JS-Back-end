const fs = require('fs');
const url = require('url');
const path = require('path');

function getContentType(url) {
    if (url.endsWith('css')) {
        return 'text/css';
    } else if (url.endsWith('js')) {
        return 'text/javascript';
    } else if (url.endsWith('json')) {
        return 'application/json';
    } else if (url.endsWith('jpg' || url.endsWith('jpeg'))) {
        return 'image/jpeg';
    } else if (url.endsWith('png')) {
        return 'image/png';
    } else if (url.endsWith('ico')) {
        return 'image/x-icon';
    }
}

module.exports = (req, res) => {
    const pathname = url.parse(req.url).pathname;

    if (pathname.startsWith('/content') && req.method === 'GET') {
        const filePath = path.normalize(path.join('content', 'site.css'));
        if (pathname.startsWith('/content') && req.method === 'GET') {
            if (pathname.endsWith('png')
                || pathname.endsWith('jpg')
                || pathname.endsWith('jpeg')
                || pathname.endsWith('ico')
                && req.method === 'GET') {
                fs.readFile(`./${pathname}`, (err, content) => {
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
                        'Content-Type': getContentType(pathname)
                    });
                    res.write(content);
                    res.end();
                });
            } else {
                fs.readFile(`./${pathname}`, 'utf-8', (err, content) => {
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
                        'Content-Type': getContentType(pathname)
                    });
                    res.write(content);
                    res.end();
                });
            }
        }
    } else {
        return true;
    }
}