const express = require('express');

const config = require('./config');
const database = require('./config/database');
const expressConfig = require('./config/express');
const routesConfig = require('./config/routes');


start();

async function start() {
    const app = express();
    await database(app);
    expressConfig(app);
    routesConfig(app);
    app.listen(config.PORT, () => console.log(`App is running on: http://localhost:${config.PORT}`));
}

