const db = require('../db.json');
const fs = require('fs/promises');
// const fs = require('fs');

const saveCat = (cat) => {
    db.cats.push(cat);

    let result = JSON.stringify(db, '', 2);

    // fs.writeFileSync('./db.json', result, {
    //     encoding: "utf8",
    // });

    return fs.writeFile('./db.json', result)
}

const storageService = {
    saveCat,
}

module.exports = storageService;