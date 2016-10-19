'use strict';

let debug = require('debug')('config-local'),
  config = require('config'),
  path = require('path'),
  fs = require('fs');

function loadLocal(cwd) {
  let ENV = process.env.NODE_ENV;
  debug('ENV = ' + ENV);

  let CWD = cwd || process.cwd();
  debug('CWD = ' + CWD);

  let DIR = _findConfigFolder(CWD);
  debug('DIR = ' + DIR);
  if (!DIR)
    return config;

  let defaultFile = DIR + '/default.json';
  if (fs.existsSync(defaultFile)) {
    debug('loading defaults: ' + defaultFile);
    let defaultConfig = require(DIR + '/default.json');
    config.util.extendDeep(config, defaultConfig);
  }
  debug('default config: ', config);

  let envifonmentFile = DIR + '/' + ENV + '.json';
  if (ENV && fs.existsSync(envifonmentFile)) {
    debug('loading environment: ' + envifonmentFile);
    let environmentConfig = require(DIR + '/' + ENV + '.json');
    config.util.extendDeep(config, environmentConfig);
  }

  debug('environment config: ', config);

  return config;
}

function _findConfigFolder(dir) {
  if (!dir)
    return false;

  // let configDir = path.dirname(dir) + '/config';//
  let configDir = dir + '/config';
  if (fs.existsSync(configDir))
    return configDir;

  return _findConfigFolder(path.dirname(dir));
}

module.exports = loadLocal;
