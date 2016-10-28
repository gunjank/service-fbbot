'use strict';


var request = require('request');
const settings = require('../config/settings');


let decisionTreeServiceHandler = {

    parseMessage: function (payloadData, cb) {
        request({
            url: settings.decisionTreeService + "/message",
            method: 'POST',
            json: payloadData
        }, function (error, response, body) {
            if (error) log.error("Decision tree message service failed and error  " + error);
            if (response) log.info("Decision tree message service successful and response status message is " + response.statusMessage);
            // if (body) log.debug("User update/insert service body -  " + body);
            cb(error, body);

        });
    }


}
module.exports = decisionTreeServiceHandler;