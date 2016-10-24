'use strict';


var request = require('request');
const settings = require('../config/settings');

let userServiceHandler = {

    updateInsertUser: function (payloadData) {
        request({
            url: settings.userServiceLocal,
            method: 'POST',
            json: payloadData
        }, function (error, response, body) {
            if (error) log.error("User update/insert failed, deails - " + error);
            if (response) log.info("User update/insert service response status message is " + response.statusMessage);
            // if (body) log.debug("User update/insert service body -  " + body);

        });
    },
    getUser: function (userId, cb) {
        console.log(settings.userServiceLocal + '?userId=' + userId)
        request({
            url: settings.userServiceLocal + '/' + userId,
            // qs: {
            //     userId: userId,
            //     time: +new Date()
            // }, //Query string data
            method: 'GET'

        }, function (error, response, body) {
            if (error) log.error("User update/insert failed, deails - " + error);
            if (response) log.info("User update/insert service response status message is " + response.statusMessage);
            // if (body) log.debug("User update/insert service body -  " + body);
            cb(response);
        });
    }

}
module.exports = userServiceHandler;