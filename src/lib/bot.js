'use strict';

const Bot = require('messenger-bot')
const settings = require('../config/settings');
const userServiceHandler = require('../handlers/userServiceHandler');
const decisionTreeHandler = require('../handlers/decisionTreeHandler');

const generator = require('./botTemplateGenerator');
let senderId = "";
let fName = "";
let lName = "";
let text = "";

let bot = new Bot({
    token: settings.botKeysCreden.page_token,
    verify: settings.botKeysCreden.verify_token,
    app_secret: settings.botKeysCreden.app_secret
})

bot.on('error', (err) => {
    console.log(err.message)
})

bot.on('message', (payload, reply) => {
        text = payload.message.text;
        senderId = payload.sender.id;
        console.log("original message payload " + JSON.stringify(payload));
        bot.getProfile(senderId, (err, profile) => {
            if (err) throw err

            fName = `${profile.first_name}`;
            lName = `${profile.last_name}`;

            let userInsertUpdatePayload = {
                "first_name": fName,
                "last_name": lName,
                "user_id": senderId

            }
            userServiceHandler.updateInsertUser(userInsertUpdatePayload);
            if (!text) {
                return;
            }
            let parseMsgPayload = {
                userId: senderId,
                text: text
            };
            console.log("original message " + parseMsgPayload.text);
            decisionTreeHandler.parseMessage(parseMsgPayload, function (error, parsedMessage) {

                if (error) {
                    reply({
                        text
                    });
                } else {
                    switch (parsedMessage.messageCode) {
                        case 0: //error     
                            commonReplyText(reply, parsedMessage.message);
                            break;
                        case 1: //station list 
                            botSendMessage(parsedMessage.data);
                            break;
                        case 2: //asking for address
                            //
                            commonReplyText(reply, parsedMessage.message);
                            break;
                        case 3: //address_saved
                            //                           
                            commonReplyText(reply, parsedMessage.message);
                            break;
                        case 4: //greetings
                            //                            
                            commonReplyText(reply, text + " " + fName);
                            break;
                        default:
                            commonReplyText(reply, parsedMessage.message);
                            break;
                    }
                }
            }); //decisionTreeHandler end
        }); //bot.getProfile end
    }) //bot on event end
let botSendMessage = function (data) {

    if (data) {

        // let buttonTemplate = generator.buttonTemplate("Stations near by", data);
        let genericTemplate = generator.genericTemplate(data);
        //let imageTemplate = generator.imageTemplate(data);

        //log.info("************ buttonTemplate " + JSON.stringify(genericTemplate));

        bot.sendMessage(senderId, genericTemplate, function (params) {
            console.log("bot send message called with genericTemplate template to " + senderId);
        });

        // bot.sendMessage(senderId, imageTemplate, function (params) {
        //     console.log("bot send message called with imageTemplate template to " + senderId);
        //     bot.sendMessage(senderId, buttonTemplate, function (params) {
        //         console.log("bot send message called with buttonTemplate template to " + senderId);
        //     });
        // });
    } else {
        log.info("botSendMessage ::  empty or null data found");
    }

}
let commonReplyText = function (reply, text) {
    console.log("bot is sending ::" + text + " ::message  to " + senderId);
    reply({
        text
    });
}

module.exports = bot;