'use strict';

const bot = require('../lib/bot');
//exports
module.exports = {

    //start web hook get handler
    webHookGetHandler: function (request, reply) {
        reply.end = function (o) {
                reply(o);
            }
            //log.info(" webhook get method  request " + JSON.stringify(request));
        return bot._verify(request, reply)

    }, //end of web hook get handler

    //start web hook post handler
    webHookPostHandler: function (request, reply) {

            reply.end = function (o) {
                    reply(o);
                }
                // log.info(" request.payload " + JSON.stringify(request.payload));
            bot._handleMessage(request.payload);
            reply(JSON.stringify({
                status: 'ok'
            }));
        } //end of handler methods

}