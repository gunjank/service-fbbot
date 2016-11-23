'use strict';

const log = require('../config/logger'),
    request = require('request'),
    settings = require('../config/settings'),
    ParsedMessage = require('../models/parsedMessage');


const decisionTreeServiceHandler = {
    parseMessage: function (payloadData, cb) {
        request({
            url: settings.decisionTreeService + "/message",
            method: 'POST',
            json: payloadData
        }, function (error, response, body) {
            if (error)
                log.error("Decision tree message service failed and error  " + error);
            if (response)
                log.info("Decision tree message service successful and response status message is " + response.statusMessage);

            if (body != null) {
                let parsedMessage = new ParsedMessage(body);
                cb(null, parsedMessage);
            } else {
                log.info("Decision tree message service - body is null");
                cb(error, null);
            }
        });
    }
}; //end of exports
module.exports = decisionTreeServiceHandler;