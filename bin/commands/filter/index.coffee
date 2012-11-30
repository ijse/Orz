###
 filter
 	根据配置文件过滤文件工具命令

 @author ijse
###

[fs, path, _] = [
	require('fs'),
	require('path'),
	require('underscore')
]

[Printer, Cwd] = []

exports.invoke = (_printer, _cwd, args)->
	[Printer, Cwd] = [_printer, _cwd]
	config = init.apply this, args

	list = readFolder config.base, config
	Printer list
	return list
	# return matched files as array

exports.param = (args) ->


init = (arg)->
	r = {}
	r.exclude = arg.exclude;
	r.include = arg.include;
	r.target = arg.target ? arg.include[arg.include.length-1];

# Collect files from folder, rely on configurations
readFolder = (folderName, config) ->

	unless fs.lstatSync(folderName).isDirectory
		return [folderName]

	[allFile, cfg] = [[], _.clone config]

	# TODO: make config.js could config
	# NOTE: Get ./config.js if has, apply the specify configuration
	# cfgPath = path.join folder, "./config.js";
	# if fs.existsSync(path.join folder, "./config.js")
	# 	cfg = _.extend(cfg, require(path.relative Cwd, cfgPath))

	files = fs.readdirSync(folder).filter (file) ->
		return true if not cfg.includes.length

		for it in cfg.includes when cfg.includes.length
			Printer "Skip file: ", it if it?.test? file

	for file in files
		# If folder
		if fs.lstatSync(file).isDirectory
			list = readFolder file

			# Concat with sub folder's file
			allFile.concat list
		# Not folder
		else
			# Check excludes
			continue if checkExcludes file, cfg.exclude

			# Put on list
			allFile.push file

	# Return
	allFile


# Check: is on excludes list?
checkExcludes = (file, excludeList) ->
	for rule in excludeList when excludeList
		pattern = rule ? new RegExp(rule);
		return false if pattern.test file
		#--------
		# For consider of json config
		# if _.isString(ex) and file is rule
		# 	return false
		# else if _.isRegExp(ex) and rule.test(file)
		# 	return false
	true

