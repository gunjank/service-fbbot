'use strict';


var request = require('request');
const settings = require('../config/settings');
let ParsedMessage = require('../models/parsedMessage');


let decisionTreeServiceHandler = {

    parseMessage: function (payloadData, cb) {
        request({
            url: settings.decisionTreeService + "/message",
            method: 'POST',
            json: payloadData
        }, function (error, response, body) {
            if (error) log.error("Decision tree message service failed and error  " + error);
            if (response) log.info("Decision tree message service successful and response status message is " + response.statusMessage);
            // log.info("************ body " + JSON.stringify(body));
            if (body != null) {
                let parsedMessage = new ParsedMessage(body);
                cb(null, parsedMessage);
            } else {
                log.info("Decision tree message service - body is null");
                cb(error, null);
            }


        });
    }


}
module.exports = decisionTreeServiceHandler;