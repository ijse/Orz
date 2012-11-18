// @author ijse
var fs = require('fs');
var path = require('path');
var _ = require('underscore');

var jsp = require("uglify-js").parser;
var pro = require("uglify-js").uglify;
var stamp = "/*-- MinJS at " + new Date().toString() + " --*/\n";

/**
 * Function: invoke
 *
 *	Minjs Entry
 *
 * Returns:
 *
 *   return description
 */
exports.invoke = function () {
	var config = init.apply(this, arguments);
	var folder = path.normalize(config.src);
	procFolder(folder, config);
};


/**
 * Function: init
 *
 * 初始化操作
 *   参数优先级：运行参数 > 当前文件夹配置文件 > 默认配置文件
 *
 *   默认为对当前路径下的所有JS文件操作（包含子文件夹）
 *
 * Returns:
 *
 *   return description
 */

function init() {
	// TODO: 对参数进一步处理
	var configStack = [
		require(__dirname + "/config.js"),
		{ src: process.cwd() }
	];
	var cfgFile = process.cwd() + "/config.js";
	if (fs.existsSync(cfgFile)) {
		configStack.push(cfgFile);
	}
	if(arguments[0]) {
		configStack.push({
			src: arguments[0]
		});
	}

	return _.extend.apply(_, configStack);
}

/**
 * Function: procFolder
 *
 * 处理文件夹
 *
 * Parameters:
 *
 *   folder - 文件夹名称
 *   cfg - 配置
 * Returns:
 *
 *   return description
 */

function procFolder(folder, cfg) {
	// var files = fs.readdirSync(folder).filter(function(file) {
	//	// Only keep the .js files
	//	return file.substr(-3) === '.js';
	// });
	var files = fs.readdirSync(folder);
	_.each(files, function (item, index, list) {
		var exit_flag = false;
		var file = path.join(folder, item);

		// Check if a folder
		if ((fs.lstatSync(file)).isDirectory()) {
			procFolder(file, cfg);
		}

		// Check if js file or .debug.js file
		if (path.extname(file) != ".js") {
			return;
		}

		// Check if excludes
		_.each(cfg.excludes, function (ex) {
			if (exit_flag) {
				return;
			}
			if (_.isRegExp(ex) && ex.test(item)) {
				console.log("忽略文件：", file);
				exit_flag = true;
			}
		});
		if (exit_flag) {
			return;
		}

		procFile(file, cfg);
	});
}

/**
 * Function: procFile
 *
 * 处理单个JS文件
 *
 * Parameters:
 *
 *   item - [type/description]
 *
 * Returns:
 *
 *   return description
 */

function procFile(item, cfg) {
	var dirName = path.dirname(item);
	var srcFile, distFile;
	var rwa = /(.+?)\.(?:(debug)\.)?js$/.exec(path.basename(item));
	if (rwa[2]) {
		srcFile = rwa.input;
		distFile = rwa[1] + ".js";
	} else {
		srcFile = rwa[1] + ".debug.js";
		distFile = rwa.input;
	}
	srcFile = path.join(dirName, srcFile);
	distFile = path.join(dirName, distFile);

	if (!rwa[2] && fs.existsSync(srcFile)) {
		// if debug file, leave it alone
		return;
	} else if (!fs.existsSync(srcFile)) {
		// if no debug file, copy distFile as srcFile
		fs.renameSync(distFile, srcFile);
	}

	// Start
	console.log("正在处理：", srcFile, "==>", distFile);
	minBuildInOne([srcFile], distFile, cfg.uglifyOptions);
}


/**
 * Function: minBuildInOne
 *
 * 批量读取文件，压缩之
 *
 * Parameters:
 *
 *   fileIn  - [type/description]
 *   fileOut - [type/description]
 *   cfg - [type/description]
 *
 * Returns:
 *
 *   return description
 */

function minBuildInOne(fileIn, fileOut, cfg) {
	var finalCode = [];
	var origCode = '';
	var ast = '';
	if (fileIn.length > 0) {
		for (var i = 0, len = fileIn.length; i < len; i++) {
			origCode = fs.readFileSync(fileIn[i], 'utf8');
			ast = jsp.parse(origCode, cfg.strict_semicolons);
			ast = pro.ast_mangle(ast, cfg);
			ast = pro.ast_squeeze(ast, cfg);

			finalCode.push(pro.gen_code(ast, cfg), ';');
		}
	}

	fs.writeFileSync(fileOut, stamp + finalCode.join(''), 'utf8');
}