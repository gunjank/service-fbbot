module.exports = function() {
  var args = {};
//  process.argv.forEach(function(arg) {
//    var _arg = arg.match(/^--([^\=]+)=(.+)/);
//    if (_arg)
//      args[_arg[1]] = _arg[2];
//  });

  for (var a in process.argv) {
    var arg = process.argv[a];
    if (/^--/.test(arg)) {
      var _arg = parse(arg)
      args[_arg.key] = _arg.value;
    }
  }

  return args;
}();

function parse(arg) {
  var a = arg.substr(2).split('=');
  return {
    key: a[0],
    value: a[1] || true
  }
}
