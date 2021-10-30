const express = require('express');
const routes = require('./routes');
const app = express();
const {initDB} = require('./config/databaseConfig');
const PORT = 5000;

require('./config/expressConfig')(app);
require('./config/handlebarsConfig')(app);
app.use(routes);
initDB()
    .then(() => {
        app.listen(PORT, () => console.log(`Running on http://localhost:${PORT}`));
    }).catch(err => {
    console.log("Error: " + err.message)
});
