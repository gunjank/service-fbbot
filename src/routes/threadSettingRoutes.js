'use strict'


const settings = require('../config/settings');
var request = require('request');
const bot = require('../lib/bot')



let payloadData = [{
  "type": "postback",
  "title": "Show me bikes",
  "payload": "Show me bikes"
}, {
  "type": "postback",
  "title": "Favorites",
  "payload": "show me my favorites"
}, {
  "type": "postback",
  "title": "Notifications",
  "payload": "Notifications"
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
  })

  app.post('/v1/sendTestMessage', (req, res) => {

    bot.sendMessage(req.body.userId, {
      "text": req.body.msg
    }, function (params) {
      res.end(JSON.stringify({
        status: 'ok',
        statusMsg: 'if params = null means all good',
        msg: req.body.msg,
        userId: req.body.userId,
        params: params
      }))
    });

  });





}