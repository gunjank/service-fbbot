'use strict';

const cfenv = require("cfenv");
let appEnv = cfenv.getAppEnv();
let botKeysService = appEnv.getService('bot_keys');

let botKeysServiceCredentials = function () {
    //** local testing **//
    if (botKeysService == null) {
        console.log('botKeysService not available, reading local hardcoded values');
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

let getUserService = function () {
    if (process.env.NODE_ENV === 'PRODUCTION') {
        return `https://service-user.cfapps.io/v1/user`;
    } else {
        return `http://localhost:3001/v1/user`;
    }
}
let getDecisionTreeService = function () {
    if (process.env.NODE_ENV === 'PRODUCTION') {
        return `https://service-decision-tree.cfapps.io/v1`;
    } else {
        return `http://localhost:3002/v1`;
    }
}

let getPersistentMenuPayload = function () {
    return [{
        "type": "postback",
        "title": "Show me bikes",
        "payload": "Show me bikes"
    }, {
        "type": "postback",
        "title": "Favorites",
        "payload": "show me my favorites"
    }, {
        "type": "postback",
        "title": "Notifications",
        "payload": "Notifications"
    }, {
        "type": "web_url",
        "title": "Help",
        "url": "https://www.facebook.com/Citibike-200455437055826/"
    }];
}



let settings = {
    botKeysCreden: botKeysServiceCredentials(),
    userService: getUserService(),
    decisionTreeService: getDecisionTreeService(),
    port: process.env.PORT || '3000',
    persistentMenu: getPersistentMenuPayload()

}

module.exports = settings;