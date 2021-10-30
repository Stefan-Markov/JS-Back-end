const uniqid = require('uniqid');
const url = require('url');

const utils = require('./utils.js');
// import utils from './utils.js';

console.log('Hello World!!!');

console.log(uniqid());

console.log(utils.calc(2, 10));
console.log(utils.div(20, 5));

let softuniUrl = 'https://softuni.bg/trainings/3496/js-back-end-september-2021#lesson-31238';

let parsedUrl = url.parse(softuniUrl);

console.log(parsedUrl);