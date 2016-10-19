# config-local

I wanted to use the Hapi plugin framework to load specific integration modules into an API, but found that the configs for each module were getting stomped on when I ran them in the server framework.  Instead of writing the same few lines of code in each plugin/module to read from the local config folder, I wrote this to make it easy.

When you call `let config = requrie('config');`, it only loads the JSON from the `process.cwd()` folder so any configs in plugins/modules are ignored.  This "could" be solved with a build tool that reads the appropriate configs from the plugins/modules and combines them into a single `.json` that is read a run-time, but that seems like a lot of unnecessary complexity.

- As a `lazy nerd`
- I want to `write a one-liner to load plugin/module local configs`
- So that `I don't have to wrangle JSON at build-time`

## Project Structure

- config/
  - default.json
  - production.json
- node_modules/
  - myPlugin/
    - config/
      - default.json
      - production.json
    - plugin.js
- server.js

```javascript
// config/default.json
{
  "port": 3000
}
```

```javascript
// config/production.json
{
  "port": 80
}
```

```javascript
// server.js
let Hapi = require('hapi'),
  config = require('config'),
  myPlugin = require('myPlugin');

let server = new Hapi.Server();

server.connection({
  port: config.port
});

server.register({
  register: myPlugin
}, (err) => {
  if (err)
    throw err;
  console.log('loaded plugin!');
});

server.start();
```

```javascript
// node_modules/myPlugin/config/default.json
{
  "myPlugin": {
    "url": "http://localhost:3001",
    "username": "readOnly",
    "password": "r34d0n1y"
  }
}
```

```javascript
// node_modules/myPlugin/config/production.json
{
  "myPlugin": {
    "url": "http://another.server.com:3001",
    "username": "readOnly",
    "password": "r34d0n1y"
  }
}
```

```javascript
// node_modules/myPlugin/plugin.js
/**
 * If we just called require('config') here, then it would only load
 * the config in the parent folder with the port values.  But, by
 * calling require('config-local')(__dirname) we're loading both the
 * parent config AND the plugin/module config;
 */
let config = require('config-local')(__dirname);

module.exports.register = function(server, options, next) {
  server.route({
    method: 'get',
    path: '/foo',
    handler: function(request, reply) {
      /* do a request to config.myPlugin.url */
      let result = request({
        url: config.myPlugin.url,
        auth: {
          user: config.myPlugin.username,
          pass: config.myPlugin.password
        }
      }, (err, res, body) => {
        reply(body);
      });
    }
  })
}

module.exports.register.attributes = {
  pkg: require('./package')
}
```

## How

`config-local` only accepts one string argument that should be `__dirname` unless you want to load a config from a non-standard location.  When you provide the `__dirname` argument, `config-local` will start there and look for a `config/` folder to read from.  If it doesn't find one, it will recurse up the path checking each step along the way until it does find a `config/` folder to read. If it doesn't find one, it will just return the global config object;

Once a `config/` folder is found, it reads the `default.json` and the appropriate `NODE_ENV` config file and uses the built-in `config.utils.deepExtend()` method to append the local configs to the global object.
