'use strict';

const log = require('../config/logger'),
    cfenv = require("cfenv"),
    appEnv = cfenv.getAppEnv();
let botKeysService = appEnv.getService('bot_keys');

const botKeysServiceCredentials = function () {
    //** local testing **//
    if (botKeysService == null) {
        log.info('botKeysService not available, reading local hardcoded values');
        const dummyData = require('./notToCommit');
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

const getDecisionTreeService = function () {
    if (process.env.NODE_ENV === 'PRODUCTION') {
        return `https://service-decision-tree.cfapps.io/v1`;
    } else {
        return `http://localhost:3002/v1`;
    }
}

const getPersistentMenuPayload = function () {
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
        },
        //  {
        //     "type": "web_url",
        //     "title": "Citi Auth",
        //     "url": "https://sandbox.apihub.citi.com/gcb/api/authCode/oauth2/authorize?response_type=code&client_id=6c675a75-1afb-43c7-8a5a-6e3bb4453685&scope=customers_profiles&countryCode=US&businessCode=GCB&locale=en_US&state=state_example&redirect_uri=https://service-user.cfapps.io",
        //     "webview_height_ratio": "compact",
        //     "messenger_extensions": true
        // },
        {
            "type": "web_url",
            "title": "Help",
            "url": "https://www.facebook.com/Citibike-200455437055826/"
        }
    ];
}



const settings = {
    botKeysCreden: botKeysServiceCredentials(),
    decisionTreeService: getDecisionTreeService(),
    port: process.env.PORT || '3003',
    persistentMenu: getPersistentMenuPayload(),
    citiLoginHeaderText: "Please login to your bank by clicking below \"Log In\" button. You will be redirected to secure login page.",
    citiAuthLoginUrl: "https://sandbox.apihub.citi.com/gcb/api/authCode/oauth2/authorize?response_type=code&client_id=6c675a75-1afb-43c7-8a5a-6e3bb4453685&scope=customers_profiles accounts_details_transactions&countryCode=US&businessCode=GCB&locale=en_US&state=@@@@@&redirect_uri=https://service-user.cfapps.io"

}

module.exports = settings;