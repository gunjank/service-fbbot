'use strict';


var request = require('request');
const settings = require('../config/settings');

let userServiceHandler = {

    updateInsertUser: function (payloadData) {
        request({
            url: settings.userService,
            method: 'POST',
            json: payloadData
        }, function (error, response, body) {
            if (error) log.error("User update/insert failed, deails - " + error);
            if (response) log.info("User update/insert service response status message is " + response.statusMessage);
        });
    }
}
module.exports = userServiceHandler;