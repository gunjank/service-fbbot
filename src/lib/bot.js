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
    let text = payload.message.text

    bot.getProfile(payload.sender.id, (err, profile) => {
        if (err) throw err

        var fName = `${profile.first_name}`;
        var lName = `${profile.last_name}`;
        var userId = payload.sender.id;
        var payloadData = {
            "first_name": fName,
            "last_name": lName,
            "user_id": userId

        }
        let parsePayload = {
            userId: userId,
            text: text
        };

        userServiceHandler.updateInsertUser(payloadData);
        console.log("original message " + parsePayload);
        decisionTreeHandler.parseMessage(parsePayload, function (error, responseMessage, data) {

            if (data) {

                //let buttonTemplate = generator.buttonTemplate("Station near by", data);
                let buttonTemplate = generator.genericMapTemplate(data);

                //log.info("************ buttonTemplate " + JSON.stringify(buttonTemplate));
                bot.sendMessage(payload.sender.id, buttonTemplate, function (params) {
                    console.log("bot send message called with button template to " + payload.sender.id)
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