// Generated by CoffeeScript 1.4.0

/*
	orz main
	@author ijse
*/


(function() {
  var Printer, args, cmd, config, formatArgs, fs, handle, os, path, program, showHelp, _ref, _ref1, _ref2, _ref3;

  _ref = [require('os'), require('fs'), require('path')], os = _ref[0], fs = _ref[1], path = _ref[2];

  _ref1 = [require("./config.json"), process.argv], config = _ref1[0], args = _ref1[1];

  program = require("commander");

  program.version('0.0.1').option("-h, --help");

  cmd = args != null ? (_ref2 = args[2]) != null ? _ref2.toLowerCase() : void 0 : void 0;

  handle = function(cmd) {
    var worker;
    worker = require("./commands/" + cmd);
    if (!worker) {
      return;
    }
    return worker.invoke.call(worker, program);
  };

  showHelp = function(target) {
    var cwd, helpText;
    cwd = process.cwd();
    if (!target) {
      helpText = fs.readFileSync("./readme.md", "utf8");
    } else {
      helpText = fs.readFileSync("./commands/" + target + "/readme.md", "utf8");
    }
    return Printer(helpText);
  };

  Printer = function() {
    return console.log.apply(console.log, arguments);
  };

  formatArgs = function(args) {
    var a, lastKey, opt, sta, _i, _len;
    opt = {
      "__files": []
    };
    sta = args != null ? args.split(" ") : void 0;
    for (_i = 0, _len = sta.length; _i < _len; _i++) {
      a = sta[_i];
      if (!(sta)) {
        continue;
      }
      lastKey = a;
      if (a[0] === ("-" || "--")) {
        opt[a] = true;
      } else {
        opt[lastKey] = a(opt[lastKey] ? void 0 : opt[lastKey].push(a));
      }
    }
    return opt;
  };

  /*
  	Dispatch
  */


  switch (cmd) {
    case void 0:
    case "help":
    case "/?":
    case "\\?":
    case "--help":
      showHelp(args[3]);
      break;
    default:
      if ((config != null ? (_ref3 = config.commands) != null ? _ref3[cmd] : void 0 : void 0) != null) {
        handle(cmd);
        process.exit(0);
      } else {
        Printer("ERROR: There is not command " + cmd + "!\n  Please type `orz help` for more info!");
        process.exit(1);
      }
  }

}).call(this);