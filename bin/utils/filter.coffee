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

exports.getFileList = (_file, config) ->
	readFolder _file, config

# Collect files from folder, rely on configurations
readFolder = (theFile, config) ->
	# to absolute path
	theFile = path.resolve process.cwd(), theFile

	# if theFile is just a file, return directly
	unless fs.lstatSync(theFile).isDirectory
		return [theFile]

	# allFile is the resulte files
	[allFile, cfg] = [[], _.clone config]

	# Get all files in this folder
	files = fs.readdirSync(theFile).filter (file) ->
		# Check if config.include exists
		# 	then filter only include files
		return true if not cfg?.include?.length
		for it in cfg.include when cfg.include.length
			Printer "Skip file: ", it if it?.test? file

	# Iterater files, filter them
	for file in files
		vfile = path.resolve theFile, file

		if fs.lstatSync(vfile).isDirectory()
			list = readFolder vfile, cfg
			# Concat with sub folder's file
			allFile.push.apply allFile, list
		else

			# Check excludes
			continue if not checkExcludes vfile, cfg.exclude

			# Put on list
			allFile.push vfile

	# Return
	allFile


# Check: is on excludes list?
checkExcludes = (file, excludeList) ->
	for rule in excludeList when excludeList
		pattern = new RegExp(rule)
		return false if pattern.test file
		#--------
		# For consider of json config
		# if _.isString(ex) and file is rule
		# 	return false
		# else if _.isRegExp(ex) and rule.test(file)
		# 	return false
	true


# exports.invoke = (_printer, _cwd, options)->

# 	[Printer, Cwd] = [_printer, _cwd]
# 	config = _.extend(
# 		exclude: []
# 		include: []
# 		target: Cwd
# 	, options);

# 	list = readFolder config.base, config
# 	Printer list
# 	return list
# 	# return matched files as array