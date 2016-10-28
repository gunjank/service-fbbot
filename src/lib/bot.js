'use strict';

const Bot = require('messenger-bot')
const settings = require('../config/settings');
const userServiceHandler = require('../handlers/userServiceHandler');
const decisionTreeHandler = require('../handlers/decisionTreeHandler');
const parser = require('../handlers/parser');

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
        decisionTreeHandler.parseMessage(parsePayload, function (error, responseMessage) {
            if (responseMessage != "") {
                text = responseMessage;
            }
            reply({
                text
            }, (error) => {
                console.log("err " + JSON.stringify(err))
                if (err) throw err
                console.log(`Echoed back to ${profile.first_name} ${profile.last_name}: ${text}`)
            })
        }); //decisionTreeHandler end



    });
})
module.exports = bot;