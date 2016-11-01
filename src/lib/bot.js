'use strict';

const Bot = require('messenger-bot')
const settings = require('../config/settings');
const userServiceHandler = require('../handlers/userServiceHandler');
const decisionTreeHandler = require('../handlers/decisionTreeHandler');

const generator = require('./botTemplateGenerator');

let bot = new Bot({
    token: settings.botKeysCreden.page_token,
    verify: settings.botKeysCreden.verify_token,
    app_secret: settings.botKeysCreden.app_secret
})

bot.on('error', (err) => {
    console.log(err.message)
})

bot.on('message', (payload, reply) => {
    let text = payload.message.text;
    let senderId = payload.sender.id;
    bot.getProfile(senderId, (err, profile) => {
        if (err) throw err

        let fName = `${profile.first_name}`;
        let lName = `${profile.last_name}`;

        let payloadData = {
            "first_name": fName,
            "last_name": lName,
            "user_id": senderId

        }
        let parsePayload = {
            userId: senderId,
            text: text
        };

        userServiceHandler.updateInsertUser(payloadData);
        console.log("original message " + parsePayload.text);
        decisionTreeHandler.parseMessage(parsePayload, function (error, responseMessage, data) {

            if (data) {

                let buttonTemplate = generator.buttonTemplate("Stations near by", data);
                //let buttonTemplate = generator.genericTemplate(data);
                let imageTemplate = generator.imageTemplate(data);

                //log.info("************ buttonTemplate " + JSON.stringify(buttonTemplate));
                bot.sendMessage(senderId, imageTemplate, function (params) {
                    console.log("bot send message called with imageTemplate template to " + senderId);
                    bot.sendMessage(senderId, buttonTemplate, function (params) {
                        console.log("bot send message called with buttonTemplate template to " + senderId);
                    });
                });

            } else {
                if (responseMessage != null && responseMessage != "") {
                    text = responseMessage;
                };
                //log.info("************ responseMessage " + responseMessage);
                reply({
                    text
                });

            }

        }); //decisionTreeHandler end



    });
})
module.exports = bot;