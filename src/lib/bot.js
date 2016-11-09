'use strict';

const Bot = require('messenger-bot')
const settings = require('../config/settings');
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


        console.log("original message payload " + JSON.stringify(payload));
        bot.getProfile(payload.sender.id, (err, profile) => {
            if (err) throw err

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
                            commonReplyText(reply, senderId, parsedMessage.message);
                            break;
                        case 1: //station list 
                            botTemplateForSendMessage(senderId, parsedMessage.data, 1);
                            break;
                        case 2: //asking for address
                            //
                            commonReplyText(reply, senderId, parsedMessage.message);
                            break;
                        case 3: //address_saved
                            //                           
                            commonReplyText(reply, senderId, parsedMessage.message);
                            break;
                        case 4: //greetings
                            //                            
                            commonReplyText(reply, senderId, text + " " + fName);
                            break;
                        case 5: //generic answer
                            //                            
                            commonReplyText(reply, senderId, parsedMessage.message);
                            break;
                        case 6: //video
                            //                            
                            botTemplateForSendMessage(senderId, parsedMessage.data, 6);
                            break;
                        default:
                            commonReplyText(reply, senderId, parsedMessage.message);
                            break;
                    }
                }
            }); //decisionTreeHandler end
        }); //bot.getProfile end
    }) //bot on event end

let botSendMessage = function (senderId, template) {
    console.log("template " + JSON.stringify(template));
    bot.sendMessage(senderId, template, function (params) {

        console.log("bot send message called with template to senderid  " + senderId);
        console.log("params " + JSON.stringify(params));
    });
};

let commonReplyText = function (reply, senderId, text) {
    console.log("bot is sending ::" + text + " ::message  to " + senderId);
    reply({
        text
    });
};
let botTemplateForSendMessage = function (senderId, data, messageCode) {
    let template;
    if (messageCode === 1) { //station list 

        // let buttonTemplate = generator.buttonTemplate("Stations near by", data);
        template = generator.genericTemplate(data);
        //let imageTemplate = generator.imageTemplate(data);
        //log.info("************ buttonTemplate " + JSON.stringify(genericTemplate));
        botSendMessage(senderId, template);

    } else if (messageCode === 6) //video
    {
        template = generator.getVideoTemplate();
        botSendMessage(senderId, template);

    } else {
        log.info("botSendMessage :: messageCode empty out of defined list");
    }

}




module.exports = bot;