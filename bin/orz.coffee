#!/usr/bin/env node
###
	orz main
	@author ijse
###

[os, fs, path] = [require('os'), require('fs'), require('path')]
[config, args] = [require("./config.json"), process.argv]

#TODO: use commander
program = require "commander"

# Prepare program
program
  .version('0.0.1')
  .option("-h, --help")

###############################


cmd = args?[2]?.toLowerCase()

# Dispatcher to invoke command
handle = (cmd) ->
	worker = require "./commands/#{cmd}"
	return if not worker
	worker.invoke.call worker, program
	# worker.invoke.apply(worker, [Printer, process.cwd(), formatArgs(args.slice 3), program])
	# worker.invoke.call worker, Printer, process.cwd(), program

# Show manual
showHelp = (target) ->
	cwd = process.cwd()
	if not target
		helpText = fs.readFileSync "./readme.md", "utf8"
	else
		helpText = fs.readFileSync "./commands/#{target}/readme.md", "utf8"
	Printer helpText

# Print to console or else
Printer = ->
	console.log.apply console.log, arguments

# Turn options to object
formatArgs = (args)->
	opt = {
		"__files": []
	}
	sta = args?.split " "
	for a in sta when sta
		lastKey = a
		if a[0] is ("-" or "--")
			opt[a] = true
		else
			opt[lastKey] = a if opt[lastKey] else opt[lastKey].push(a)
	opt


###
	Dispatch
###
switch cmd
	when undefined, "help", "/?", "\\?", "--help" then showHelp args[3]
	else
		if config?.commands?[cmd]?
			handle cmd
			process.exit(0)
		else
			#TODO: Print no this command
			Printer """
				ERROR: There is not command #{cmd}!
				  Please type `orz help` for more info!
			"""
			process.exit(1)
