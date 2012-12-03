###
	Replace something in files

	@author ijse
###
[fs, path, _] = [
	require("fs"),
	require("path"),
	require("underscore")
]

FilterUtil = require("../../utils/filter")

#TODO: Get files list
#TODO: Iterater files, match the target
#TODO: Save to (new) file
##
#NOTE: Add config support (Config Util)
#NOTE: ss

exports.invoke = (program)->
	Cwd = process.cwd()
	parseArray = (val)-> val.split(",")

	program
		.usage("orz replacex [options] <file ...>")
		.option("-c, --config [config_file]",
				"Specify the config file, default to config.json")
		.option("-o, --oldStr <string>", "String to be replaced")
		.option("-n, --newStr <string>", "New string")
		.option("-i, --include [include_files]", "Only include files", parseArray)
		.option("-e, --exclude [exclude_files]",
				"Files that not included, regex expression", parseArray)
		.parse(process.argv)

	console.log "Arguments:"
	console.log "config: ", program.config
	console.log "include: ", program.include
	console.log "exclude: ", program.exclude
	console.log "args: ", program.args

	console.log "target: ", program.args[1] ? Cwd

	Config = include: [], exclude: []

	# The folder or file to be resolved
	Target = program.args[1] ? Cwd

	# if config.js
	if program.config
		# read config file
		configPath = path.join Cwd, program.config
		Config = require configPath

	# merge config
	_.extend(Config, include: program.include or [])
	_.extend(Config, exclude: program.exclude or [])
	_.extend(Config, newStr: program.newStr or "")
	_.extend(Config, oldStr: program.oldStr or "")


	console.log "Final configuration: ", Config

	fileList = FilterUtil.getFileList(Target, Config)

	console.log "File to process:"
	console.log fileList

	for file in fileList when fileList

		console.log "Read file ==>#{file}"

		data = fs.readFileSync file, "utf8"
		console.log "Process: #{Config.oldStr} -> #{Config.newStr}"
		oStrReg = new RegExp(Config.oldStr)
		if oStrReg.test data
			console.log "Found oldstr, replace"

			data = data.replace(oStrReg, Config.newStr)
			fs.writeFileSync(file, data, "utf8")


		# fs.readFile file, "utf8", (err, data)->
		# 	if err
		# 		console.log "Error when handle file: #{file}!"
		# 		return

		# 	console.log "Process: #{Config.oldStr} -> #{Config.newStr}"
		# 	oStrReg = new RegExp(Config.oldStr)
		# 	if oStrReg.test data
		# 		console.log "Found oldstr, replace"

		# 		data = data.replace(oStrReg, Config.newStr)
		# 		fs.writeFile file + "_", data, "utf8"

	console.log("done!");