###
	minjs
	@author ijse
###

fs = require('fs')
path = require('path')
_ = require('underscore')

jsp = require('uglify-js').parser
pro = require('uglify-js').uglify
stamp = "/*-- MinJS at [" + new Date().toString() + "] --*/\n";

# Interface
exports.invoke = ->
	config = init.apply this,arguments
	folder = path.normalize config.src
	procFolder folder, config

# init

init = ->
	configStack = [
		(require __dirname + "/config.js"),
		src: process.cwd()
	]
	cfgFile = process.cwd + "/config.js"
	(configStack.push cfgFile) if fs.existsSync cfgFile
	(configStack.push src:arguments[0]) if arguments[0]

	_.extend.apply _, configStack


procFolder = (folder, _cfg) ->
	cfg = _.clone _cfg
	specConfigPath path.join folder, "./config.js"

	if fs.existsSync specConfigPath 
		tpath = path.relative __dirname, specConfigPath
		specConfig = require tpath
		cfg = _.extend cfg, specConfig

	files = (fs.readdirSync folder).filter (file) ->
		i = 0
		if cfg.includes.length
			loop
				it = cfg.includes[i]
				if it and it.test file
					console.log "\n\n$$$\n\n"
					return true
				++i
			break unless it
		else return true
	_.each files, (item, index, list) ->
		exit_flag = false
		file = path.join folder, item
		procFolder file, cfg if (fs.lstatSync file).isDirectory

		return if path.extname file isnt ".js"

		_.each cfg.excludes (ex) ->
			return if exit_flag
			if _.isRegExp ex and ex.test item
				exit_flag = true

		return if exit_flag

		procFile file, cfg


procFile = (item, cfg) ->
	dirName = path.dirname item
	rwa = /// 
		(.+?)\. 		# filename
		(?:(debug)\.)? 	# .debug
		js$				# extname
		///.exec path.basename item
