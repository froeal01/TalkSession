{exec} = require "child_process"

REPORTER = "min"

task 'test', 'run tests', ->
	exec "NODE_ENV=TEST
		./node_modules/.bin/mocha
		--reporter #{REPORTER}
		--require coffee-script
		--colors
		",(err,output) ->
			throw err if err
			console.log output