'use strict';

const log = require('../config/logger'),
    Bot = require('messenger-bot'),
    settings = require('../config/settings'),
    decisionTreeHandler = require('../handlers/decisionTreeHandler'),
    generator = require('./botTemplateGenerator');

const bot = new Bot({
    token: settings.botKeysCreden.page_token,
    verify: settings.botKeysCreden.verify_token,
    app_secret: settings.botKeysCreden.app_secret
})

bot.on('error', (err) => {
    log.error(err.message)
})

bot.on('message', (payload, reply) => {


        log.info("original message payload " + JSON.stringify(payload));
        bot.getProfile(payload.sender.id, (err, profile) => {
            if (err)
                throw err;

            const fName = `${profile.first_name}`;
            const senderId = payload.sender.id;
            let text = payload.message.text;

            //general text message -
            //{"sender":{"id":"1234"},"recipient":{"id":"123456"},"timestamp":1478271995980,"message":{"mid":"mid.1478271995980:0de56e7287","seq":2332,"text":"show me bikes near home"}}

            //message with location 
            // {"sender":{"id":"2323"},"recipient":{"id":"2323"},"timestamp":1478272713759,
            // "message":{"mid":"mid.1478272713759:8d9575f369","seq":2338,"attachments":[{"title":" Location","url":"https://www.facebook.com/l.php?u=https%3A%t-kw","type":"location",
            // "payload":{"coordinates":{"lat":40.746241456646,"long":-73.944407821878}}}]}}


            if (!text) {

                if (null != payload.message.attachments && payload.message.attachments.length > 0) {
                    //let 
                    for (let attachment of payload.message.attachments) {
                        if (attachment.type === 'location' && null != attachment.payload && null != attachment.payload.coordinates && null != attachment.payload.coordinates.lat) {
                            const re = new RegExp('\\.');
                            let lat = attachment.payload.coordinates.lat.toString();
                            lat = lat.replace(re, "DOT");
                            let long = attachment.payload.coordinates.long.toString();
                            long = long.replace(re, "DOT");
                            text = "LATLONG LAT " + lat + " LONG " + long;
                            break;
                        }
                    }
                }
                //if still no text then return
                if (!text) return;
            }
            let parseMsgPayload = {
                userId: senderId,
                text: text
            };
            log.info("original message " + parseMsgPayload.text);
            decisionTreeHandler.parseMessage(parseMsgPayload, function (error, parsedMessage) {

                if (error) {
                    reply({
                        text
                    });
                } else {
                    switch (parsedMessage.messageCode) {
                        case 2:
                        case 3:
                        case 5:
                        case 0: //0=error ,2=asking address,3=address saved, 5= generic answer 
                            commonReplyText(reply, senderId, parsedMessage.message);
                            break;
                        case 1: //station list 
                            botTemplateForSendMessage(senderId, parsedMessage.data, 1);
                            break;
                        case 4: //greetings
                            commonReplyText(reply, senderId, text + " " + fName);
                            break;
                        case 6: //video
                            botTemplateForSendMessage(senderId, parsedMessage.data, 6);
                            break;
                        case 7: //accounts found
                            handleAccountsDetails(senderId, parsedMessage.data);
                            break;
                        case 8: //no account found
                            botTemplateForSendMessage(senderId, parsedMessage.message, 8);
                            break;
                        default:
                            commonReplyText(reply, senderId, parsedMessage.message);
                            break;
                    }
                }
            }); //decisionTreeHandler end
        }); //bot.getProfile end
    }) //bot on event end

const botSendMessage = function (senderId, template) {
    log.info("template " + JSON.stringify(template));
    bot.sendMessage(senderId, template, function (params) {

        log.info("bot send message called with template to senderid  " + senderId);
        log.info("params " + JSON.stringify(params));
    });
};

const commonReplyText = function (reply, senderId, text) {
    log.info("bot is sending ::" + text + " ::message  to " + senderId);
    reply({
        text
    });
};
const botTemplateForSendMessage = function (senderId, data, messageCode) {
    let template;
    if (messageCode === 1) { //station list         
        template = generator.genericTemplate(data);
    } else if (messageCode === 6) //video
    {
        template = generator.getVideoTemplate();
    } else if (messageCode === 8) { //no account found
        template = generator.citiLoginTemplate(senderId);
    }
    botSendMessage(senderId, template);
}
const handleAccountsDetails = (senderId, data) => {
    const template = {};
    let accountDetails = "You account details  are :";
    if (null != data && null != data.accountGroupSummary && data.accountGroupSummary.length > 0) //have account
    {
        for (const accountGroupSummary of data.accountGroupSummary) {
            if (accountGroupSummary.accountGroup === "CREDITCARD") //all credit card will come here
            {
                accountDetails = "Credit cards : \r\n"
                for (const account of accountGroupSummary.accounts) {
                    accountDetails += " Product Name :" + account.creditCardAccountSummary.productName + "\r\n";
                    accountDetails += " Outstanding Balance :" + account.creditCardAccountSummary.outstandingBalance + "\r\n";
                    accountDetails += " Available Credit :" + account.creditCardAccountSummary.availableCredit + "\r\n";
                    accountDetails += " Credit Limit :" + account.creditCardAccountSummary.creditLimit + "\r\n";
                    accountDetails += " Payment Due Date :" + account.creditCardAccountSummary.paymentDueDate + "\r\n";
                    accountDetails += "\r\n";
                }
            }
        }

    }

    template.text = accountDetails;
    log.info({
        accounts: data,
        template: template,
    }, 'account details')
    botSendMessage(senderId, template);
}
module.exports = bot;