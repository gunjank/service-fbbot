'use strict'

const bot = require('../lib/bot'),
    appHandler = require('../handlers/appHandler'),
    Joi = require('joi');

const samplePayload = `{"object":"page","entry":[{"id":"123456","time":1478725703968,"messaging":[{"sender":{"id":"11223344"},    
 "recipient":{"id":"22334455"},"timestamp":1478725703948,"message": 
  {"mid":"mid.1234:f57313b019","seq":123,"text":"hello"}}]}]}`;

module.exports = function (server) {
    //all root level web-hook get call handler
    server.route({
        method: 'get',
        path: '/',
        config: {
            handler: appHandler.webHookGetHandler,
            description: 'Facebook Webhook route for get calls',
            notes: 'Facbook will call this method',
            tags: ['api'],
            validate: {

            }
        }
    });
    //all root level web-hook post call handler
    server.route({
        method: 'post',
        path: '/',
        config: {
            handler: appHandler.webHookPostHandler,
            description: 'Facebook Webhook route for post calls',
            notes: 'Facebook will call this url, sample payload ' + samplePayload,
            tags: ['api'],
            validate: {
                payload: Joi.object().allow(null)
            }
        }
    });

}