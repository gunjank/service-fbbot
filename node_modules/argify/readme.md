# Argify [![Build Status](https://secure.travis-ci.org/ben-bradley/argify.png)](http://travis-ci.org/ben-bradley/argify)

A very small bit of code that I got tired of typing again and again.

It parses command line arguments formatted like: `$ node ./yourscript.js --blargh=honk`

## Install

`npm install argify`

`npm install ben-bradley/argify`

## Use

```javascript
// yourscript.js
var args = require('argify');

console.log(args);        // stdout: { blargh: 'honk' }
console.log(args.blargh); // stdout: 'honk'
console.log(args.foo);    // stdout: true
```

`$ node ./yourscript.js --blargh=honk --foo`

## Version

- 0.0.3 - added boolean options
- 0.0.2 - fixed package.json keywords, added travis bling, standardized structure
- 0.0.1 - initial drop
