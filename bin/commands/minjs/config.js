module.exports = {
	src: "../test/commands/minjs/testjs",
	excludes: [/config.js/],
	includes: [

	],

	uglifyOptions: {
		
		// If you pass true then the parser will throw an error
		// when it expects a semicolon and it doesn’t find it.
		// For most JS code you don’t want that,
		// but it’s useful if you want to strictly sanitize your code.
		strict_semicolons: false,

		// mangle toplevel names (by default we don’t touch them).
		// toplevel: "",
		// an array of names to exclude from compression.
		// default to support SeaJs module
		except: [ "require", "exports", "module" ],

		// an object with properties named after symbols to replace
		// (see the --define option for the script)
		// and the values representing the AST replacement value.
		// For example, { defines: { DEBUG: ['name', 'false'], VERSION: ['string', '1.0'] } }
		defines: {},

		// which will cause consecutive statements in a block to be merged using the “sequence” (comma) operator
		make_seqs: true,

		// which will remove unreachable code.
		dead_code: true,

		// pass true if you want indented output
		beautify: false,

		// (only applies when beautify is true) – initial indentation in spaces
		indent_start: 0,

		// (only applies when beautify is true) – indentation level, in spaces (pass an even number)
		indent_level: 4,

		// if you pass true it will quote all keys in literal objects
		quote_keys: false,

		// (only applies when beautify is true) – wether to put a space before the colon in object literals
		space_colon: false,

		// pass true if you want to encode non-ASCII characters as \uXXXX.
		ascii_only: false,

		// pass true to escape occurrences of </script in strings
		inline_script: false
	}
};