// const fs = require('fs');
const fs = require('fs/promises');

// Synchronous
// let text = fs.readFileSync('./index.html', 'utf8');
// console.log(text);

// Async
// fs.readFile('./index.html', 'utf8', (err, text) => {
//     if (err) {
//         return;
//     }

//     console.log(text);
// });

// Promise
fs.readFile('./index.html', 'utf8')
    .then(text => {
        console.log(text);
    });

// Async Function
// async function readFile(path) {
//     let text = await fs.readFile(path, 'utf8');

//     console.log(text);
// }

// readFile('./index.html');

console.log('END');