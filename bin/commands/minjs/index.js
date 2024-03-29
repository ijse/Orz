// Generated by CoffeeScript 1.4.0

/*
	minjs
	@author ijse
*/


(function() {
  var fs, init, jsp, path, pro, procFile, procFolder, stamp, _;

  fs = require('fs');

  path = require('path');

  _ = require('underscore');

  jsp = require('uglify-js').parser;

  pro = require('uglify-js').uglify;

  stamp = "/*-- MinJS at [" + new Date().toString() + "] --*/\n";

  exports.invoke = function() {
    var config, folder;
    config = init.apply(this, arguments);
    folder = path.normalize(config.src);
    return procFolder(folder, config);
  };

  init = function() {
    var cfgFile, configStack;
    configStack = [
      require(__dirname + "/config.js"), {
        src: process.cwd()
      }
    ];
    cfgFile = process.cwd + "/config.js";
    if (fs.existsSync(cfgFile)) {
      configStack.push(cfgFile);
    }
    if (arguments[0]) {
      configStack.push({
        src: arguments[0]
      });
    }
    return _.extend.apply(_, configStack);
  };

  procFolder = function(folder, _cfg) {
    var cfg, files, specConfig, tpath;
    cfg = _.clone(_cfg);
    specConfigPath(path.join(folder, "./config.js"));
    if (fs.existsSync(specConfigPath)) {
      tpath = path.relative(__dirname, specConfigPath);
      specConfig = require(tpath);
      cfg = _.extend(cfg, specConfig);
    }
    files = (fs.readdirSync(folder)).filter(function(file) {
      var i, it;
      i = 0;
      if (cfg.includes.length) {
        while (true) {
          it = cfg.includes[i];
          if (it && it.test(file)) {
            console.log("\n\n$$$\n\n");
            return true;
          }
          ++i;
        }
        if (!it) {
          break;
        }
      } else {
        return true;
      }
    });
    return _.each(files, function(item, index, list) {
      var exit_flag, file;
      exit_flag = false;
      file = path.join(folder, item);
      if ((fs.lstatSync(file)).isDirectory) {
        procFolder(file, cfg);
      }
      if (path.extname(file !== ".js")) {
        return;
      }
      _.each(cfg.excludes(function(ex) {
        if (exit_flag) {
          return;
        }
        if (_.isRegExp(ex && ex.test(item))) {
          return exit_flag = true;
        }
      }));
      if (exit_flag) {
        return;
      }
      return procFile(file, cfg);
    });
  };

  procFile = function(item, cfg) {
    var dirName, rwa;
    dirName = path.dirname(item);
    return rwa = /(.+?)\.(?:(debug)\.)?js$/.exec(path.basename(item));
  };

}).call(this);
