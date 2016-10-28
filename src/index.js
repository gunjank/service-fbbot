'use strict'


const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const bunyan = require('bunyan');






global.log = bunyan.createLogger({
    name: 'node-fbbot'
});
const settings = require('./config/settings');
let app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))


let webHookRoutes = require('./routes/webHookRoutes')(app);
let threadSettingRoutes = require('./routes/threadSettingRoutes')(app);

//**Test code start 
// var decisionTreeHandler = require('./handlers/decisionTreeHandler');
// let parsePayload = {
//     "userId": "994195690708817",
//     "text": "show ME BIKES NEAR home1"
// };
// decisionTreeHandler.parseMessage(parsePayload, function (error, responseMessage) {
//     if (responseMessage != "") {
//         let text = responseMessage;
//         console.log(text);
//     }

// });

//**Test code end
let server = http.createServer(app).listen(settings.port, function () {
    log.info("Server is running ");
});