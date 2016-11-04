'use strict';

const Bot = require('messenger-bot')
const settings = require('../config/settings');
const userServiceHandler = require('../handlers/userServiceHandler');
const decisionTreeHandler = require('../handlers/decisionTreeHandler');

const generator = require('./botTemplateGenerator');
let senderId = "";
let fName = "";
//let lName = "";
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
            //lName = `${profile.last_name}`;
            //if user update needed
            // let userInsertUpdatePayload = {
            //         "first_name": fName,
            //         "last_name": lName,
            //         "user_id": senderId

            //     }
            //we don't need to insert/update user here for each call'
            //userServiceHandler.updateInsertUser(userInsertUpdatePayload);
            //general text message -
            //{"sender":{"id":"1120350294667738"},"recipient":{"id":"200455437055826"},"timestamp":1478271995980,"message":{"mid":"mid.1478271995980:0de56e7287","seq":2332,"text":"show me bikes near home"}}

            //message with location 
            // {"sender":{"id":"994195690708817"},"recipient":{"id":"200455437055826"},"timestamp":1478272713759,
            // "message":{"mid":"mid.1478272713759:8d9575f369","seq":2338,"attachments":[{"title":"Gunjan's Location","url":"https://www.facebook.com/l.php?u=https%3A%2F%2Fwww.bing.com%2Fmaps%2Fdefault.aspx%3Fv%3D2%26pc%3DFACEBK%26mid%3D8100%26where1%3D40.746241456646%252C%2B-73.944407821878%26FORM%3DFBKPL1%26mkt%3Den-US&h=XAQGgKGMC&s=1&enc=AZOvlI92Rzt3rJ3ytVLWnMQ7eP0uWZVSy_ulAETli9p401pYB91cs_IrZLot_wUGFkYMigeZucJ8MOpimdrA5w7dQbuPOBQusrZqNwy8C-t-kw","type":"location",
            // "payload":{"coordinates":{"lat":40.746241456646,"long":-73.944407821878}}}]}}


            if (!text) {

                if (null != payload.message.attachments && payload.message.attachments.length > 0) {
                    //let 
                    for (let attachment of payload.message.attachments) {
                        if (attachment.type = 'location' && null != attachment.payload && null != attachment.payload.coordinates && null != attachment.payload.coordinates.lat) {
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
                        case 5: //generic answer
                            //                            
                            commonReplyText(reply, parsedMessage.message);
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