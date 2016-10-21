'use strict'


const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const bunyan = require('bunyan');




let app = express()

global.log = bunyan.createLogger({
    name: 'node-fbbot'
});



app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))


let webHookRoutes = require('./routes/webHookRoutes')(app);
let threadSettingRoutes = require('./routes/threadSettingRoutes')(app);
http.createServer(app).listen(process.env.PORT || 3000)