'use strict'

const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const bunyan = require('bunyan');
global.log = bunyan.createLogger({
    name: 'service-fbbot'
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
//     "text": "show ME BIKES NEAR home"
// };
// decisionTreeHandler.parseMessage(parsePayload, function (error, responseMessage, data) {
//     if (responseMessage != "") {
//         let text = responseMessage;
//         console.log(text);
//     } else {

//         let buttonTemplate = generator.buttomTemplate("hello", data);
//         console.log(JSON.stringify(buttonTemplate));
//     }

// });
// var payloadData = {
//     "first_name": "hello",
//     "last_name": "user",
//     "user_id": "123456"

// }

// userServiceHandler.updateInsertUser(payloadData);

//**Test code end
let server = http.createServer(app).listen(settings.port, function () {
    log.info("Server is running ");
});