'use strict'


const settings = require('../config/settings');
var request = require('request');
const bot = require('../lib/bot')



let payloadData = [{
  "type": "postback",
  "title": "Show me bikes",
  "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_HELP"
}, {
  "type": "postback",
  "title": "Favorites",
  "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_HELP"
}, {
  "type": "postback",
  "title": "Notifications",
  "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_HELP"
}, {
  "type": "web_url",
  "title": "Help",

  "url": "https://www.facebook.com/Citibike-200455437055826/"
}];




module.exports = function (app) {




  app.get('/v1/threadSettings', (req, res) => {

    bot.setPersistentMenu(payloadData, function (params) {
      res.end(JSON.stringify({
        status: 'ok',
        params: params
      }))
    });


    //  bot.setGetStartedButton([{"payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_HELP"}], function (params) {
    //       res.end(JSON.stringify({
    //         status: 'ok',
    //         params: params
    //       }))
    //     });


    //------------------working sending message code------//
    // bot.sendMessage("994195690708817", {
    //   "text": "hellow world"
    // }, function (params) {
    //   res.end(JSON.stringify({
    //     status: 'ok',
    //     params: params
    //   }))
    // });

  })



}