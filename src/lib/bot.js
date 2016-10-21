'use strict';

const Bot = require('messenger-bot')
const settings = require('../config/settings');
const Wreck = require('wreck');

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
            "user_id": userId,
            "address": []
        }

        Wreck.post('https://service-user.cfapps.io/v1/user', {
            payload: payloadData
        }, (err, res, payload) => {
            console.log("user data saved to db");
        });

        //--------------------------------------



        //-----------------------------

        reply({
            text
        }, (err) => {
            if (err) throw err

            console.log(`Echoed back to ${profile.first_name} ${profile.last_name}: ${text}`)
        })
    })
})
module.exports = bot;