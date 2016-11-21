'use strict'

const bot = require('../lib/bot');

let senderId = '1120350294667738';

let tmp = {
    "attachment": {
        "type": "template",
        "payload": {
            "template_type": "button",
            "text": "Please login to your bank by clicking below \"Log In\" button. You will be redirected to secure login page.",
            "buttons": [{
                "type": "web_url",
                "url": "https://sandbox.apihub.citi.com/gcb/api/authCode/oauth2/authorize?response_type=code&client_id=6c675a75-1afb-43c7-8a5a-6e3bb4453685&scope=customers_profiles accounts_details_transactions&countryCode=US&businessCode=GCB&locale=en_US&state=" + senderId + "&redirect_uri=https://service-user.cfapps.io",
                "title": "Log In"
            }, {
                "type": "postback",
                "title": "Start Chatting",
                "payload": "USER_DEFINED_PAYLOAD"
            }]
        }
    }
};




let template = {
    text: "hi"
};
bot.sendMessage(senderId, tmp, function (params) {

    console.log("bot send message called with template to senderid  " + senderId);
    console.log("params " + JSON.stringify(params));
});