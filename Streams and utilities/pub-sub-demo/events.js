const events = require('Streams and utilities/pub-sub-demo/events');

let eventEmitter = new events.EventEmitter();

eventEmitter.on('customEvent', (first, second) => {
    console.log('First: ', first);
    console.log('Second: ', second);
});

setTimeout(() => {
    eventEmitter.emit('customEvent', 'Pesho', 'Gosho');
}, 2000)