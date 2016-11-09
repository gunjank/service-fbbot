'use strict'

const bunyan = require('bunyan');
global.log = bunyan.createLogger({
    name: 'service-fbbot'
});

const http = require('http'),
    express = require('express'),
    bodyParser = require('body-parser'),
    settings = require('./config/settings');

let app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))


let webHookRoutes = require('./routes/webHookRoutes')(app);
let threadSettingRoutes = require('./routes/threadSettingRoutes')(app);
let server = http.createServer(app).listen(settings.port, function () {
    log.info("Server is running ");
});