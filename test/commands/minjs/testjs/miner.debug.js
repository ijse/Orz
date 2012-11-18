var fs  = require('fs');
var jsp = require("uglify-js").parser;
var pro = require("uglify-js").uglify;
var stamp = "/*-- MinJS --*/\n";

// 批量读取文件，压缩之
function minBuildInOne(fileIn, fileOut) {
    var finalCode = [];
    var origCode = '';
    var ast = '';
    if (fileIn.length > 0) {
        for (var i = 0,len = fileIn.length; i < len; i++) {
            origCode = fs.readFileSync(fileIn[i], 'utf8');
            ast = jsp.parse(origCode);
            ast = pro.ast_mangle(ast);
            ast = pro.ast_squeeze(ast);

            finalCode.push(pro.gen_code(ast), ';');
        }
    }

    console.log("---");
    
    fs.writeFileSync(fileOut, stamp + finalCode.join(''), 'utf8');
}

exports.min = minBuildInOne


