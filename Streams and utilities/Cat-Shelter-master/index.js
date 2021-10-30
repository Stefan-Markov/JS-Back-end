const http = require('http');
const handlers = require('./handlers');
const PORT = process.env.PORT || 5000;

const server = http.createServer((req, res) => {
   for (let handler of handlers) {
       if(!handler(req, res)) {
           break;
       }
   }
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
