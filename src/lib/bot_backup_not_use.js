'use strict';

const Bot = require('messenger-bot')
const settings = require('../config/settings');
const userServiceHandler = require('../handlers/userServiceHandler');
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
                "user_id": userId,
                "address": []
            }
            //         log.info(payload);
            //         log.info(profile);

        //payload =  "sender":{"id":"994195690708817"},"recipient":{"id":"200455437055826"},"timestamp":1477062456931,"message":{"mid":"mid.1477062456931:2908cfd389","seq":331,"text":"Hello"},
        //profile 
        //"first_name":"Gunjan","last_name":"Kumar","profile_pic":"https://scontent.xx.fbcdn.net/v/t1.0-1/13043701_10153740762677979_1000500651719455945_n.jpg?oh=fa798e9a8a7bbc0d4aec85e45fc28ed5&oe=58AC353A",
        // "locale":"en_US","timezone":-4,"gender":"male"


        // userServiceHandler.updateInsertUser(payloadData);
        // log.info("text  " + text);
        parser.parse(text, payload, profile, function (text) {
            if (text == "1005") {


                let add = {
                    "attachment": {
                        "type": "template",
                        "payload": {
                            "template_type": "button",
                            "text": "Below are the nearest stations",
                            "buttons": [{
                                "type": "postback",
                                "title": "Station 78, bikes 5 av",
                                "payload": "USER_DEFINED_PAYLOAD"
                            }, {
                                "type": "postback",
                                "title": "Station 72, bike 5 av",
                                "payload": "USER_DEFINED_PAYLOAD"
                            }]
                        }
                    }
                }



                bot.sendMessage(payload.sender.id, add, function (params) {
                    console.log("ok")
                });






            } else {
                reply({
                    text
                }, (err) => {
                    console.log("err " + JSON.stringify(err))
                    if (err) throw err

                    console.log(`Echoed back to ${profile.first_name} ${profile.last_name}: ${text}`)
                })
            }




        });



    })
})
module.exports = bot;