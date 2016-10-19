'use strict';

var debug = require('debug')('config-local'),
    config = require('config'),
    path = require('path'),
    fs = require('fs');

function loadLocal(cwd) {
  var ENV = process.env.NODE_ENV;
  debug('ENV = ' + ENV);

  var CWD = cwd || process.cwd();
  debug('CWD = ' + CWD);

  var DIR = _findConfigFolder(CWD);
  debug('DIR = ' + DIR);
  if (!DIR) return config;

  var defaultFile = DIR + '/default.json';
  if (fs.existsSync(defaultFile)) {
    debug('loading defaults: ' + defaultFile);
    var defaultConfig = require(DIR + '/default.json');
    config.util.extendDeep(config, defaultConfig);
  }
  debug('default config: ', config);

  var envifonmentFile = DIR + '/' + ENV + '.json';
  if (ENV && fs.existsSync(envifonmentFile)) {
    debug('loading environment: ' + envifonmentFile);
    var environmentConfig = require(DIR + '/' + ENV + '.json');
    config.util.extendDeep(config, environmentConfig);
  }

  debug('environment config: ', config);

  return config;
}

function _findConfigFolder(_x) {
  var _again = true;

  _function: while (_again) {
    var dir = _x;
    configDir = undefined;
    _again = false;

    if (!dir) return false;

    // let configDir = path.dirname(dir) + '/config';//
    var configDir = dir + '/config';
    if (fs.existsSync(configDir)) return configDir;

    _x = path.dirname(dir);
    _again = true;
    continue _function;
  }
}

module.exports = loadLocal;