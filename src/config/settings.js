'use strict';
const cfenv = require("cfenv");
let appEnv = cfenv.getAppEnv();
let botKeysService = appEnv.getService('bot_keys');

let botKeysServiceCredentials = function () {
    //** local testing **//
    if (botKeysService == null) {
        log.error('botKeysService not available, reading local hardcoded values');
        let dummyData = require('./notToCommit');
        botKeysService = {};
        botKeysService.credentials = {};
        botKeysService.credentials.app_secret = dummyData.app_secret;
        botKeysService.credentials.page_token = dummyData.page_token;
        botKeysService.credentials.verify_token = dummyData.verify_token;
    } else {
        log.info('botKeysService  available, reading user provided services');
    }
    return botKeysService.credentials;

}

let settings = {
    botKeysCreden: botKeysServiceCredentials(),
    userService: `https://service-user.cfapps.io/v1/user`,
    userServiceLocal: `http://localhost:3001/v1/user`,
    port: process.env.PORT || '3000',



}

module.exports = settings;