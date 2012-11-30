`#!/usr/bin/env node`
###
	orz main
	@author ijse
###

[os, fs, path] = [require('os'), require('fs'), require('path')]
[config, args] = [require("#{process.pwd()}/config.json"), process.argv]

cmd = args?[2]?.toLowerCase()

switch cmd
	when undefined, "help", "/?", "\\?", "--help" then showHelp args[3]
	else handle cmd

# Dispatcher to invoke command
handle = (cmd) ->
	worker = require "#{process.pwd()}/commands/#{cmd}"
	return if not worker
	worker.invoke.apply(worker, [Printer, process.cwd(), formatArgs(args.slice 3)])

# Show manual
showHelp = (target) ->
	cwd = process.cwd()
	if not target
		helpText = fs.readFileSync "#{cwd}/readme.md", "utf8"
	else
		helpText = fs.readFileSync "#{cwd}/commands/#{target}/readme.md", "utf8"
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