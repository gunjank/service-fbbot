'use strict'

const settings = require('../config/settings'),
  threadSettingsHandler = require('../handlers/threadSettingsHandler'),
  request = require('request'),
  bot = require('../lib/bot'),
  Joi = require('joi');

module.exports = function (server) {

  server.route({
    method: 'get',
    path: '/v1/threadSettings',
    config: {
      handler: threadSettingsHandler.persistentMenu,
      description: 'threadSettings calls, used for persistent menu',
      notes: 'list of menu items in json format',
      tags: ['api'],
      validate: {

      }
    }
  });

  server.route({
    method: 'post',
    path: '/v1/sendTestMessage',
    config: {
      handler: threadSettingsHandler.sendMessage,
      description: 'get places nearby to given address with geo location',
      notes: 'sample payload json data ',
      tags: ['api'],
      validate: {
        payload: Joi.object().keys({
          userId: Joi.string().required(),
          msg: Joi.string().required()
        })

      }
    }
  });

}