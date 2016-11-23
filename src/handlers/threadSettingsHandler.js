'use strict';

const log = require('../config/logger'),
    bot = require('../lib/bot'),
    settings = require('../config/settings');

//exports
module.exports = {

    //start web hook get handler
    persistentMenu: function (request, reply) {
        reply.end = function (o) {
            reply(o);
        }
        if (null === request.payload) {
            request.payload = settings.persistentMenu; //sample
        }
        bot.setPersistentMenu(request.payload, function (params) {
            reply(JSON.stringify({
                status: 'ok',
                data: request.payload,
                params: params
            }))
        });
    }, //end of web hook get handler

    //start web hook post handler
    sendMessage: function (request, reply) {

            reply.end = function (o) {
                reply(o); //this is required to override internal bot engine which was based on express 
            }
            bot.sendMessage(request.payload.userId, {
                "text": request.payload.msg
            }, function (params) {
                reply(JSON.stringify({
                    status: 'ok',
                    statusMsg: 'if params = null means all good',
                    msg: request.payload.msg,
                    userId: request.payload.userId,
                    params: params
                }))
            });
        } //end of handler methods

};