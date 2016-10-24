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

//**Test code start 
var parser = require('./handlers/parser');

var text = "show me bikes near { home }";
var payload = {};
payload.sender = {};
payload.sender.id = '994195690708817';
var profile = {};
parser.parse(text, payload, profile, function (text) {

    console.log("parse " + text)
});

//**Test code end
http.createServer(app).listen(process.env.PORT || 3000)