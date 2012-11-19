/*-- MinJS at [Sun Nov 18 2012 20:07:48 GMT+0800 (中国标准时间)] --*/
function minBuildInOne(e, t) {
    var n = [], r = "", i = "";
    if (e.length > 0) for (var s = 0, o = e.length; s < o; s++) r = fs.readFileSync(e[s], "utf8"), i = jsp.parse(r), i = pro.ast_mangle(i), i = pro.ast_squeeze(i), n.push(pro.gen_code(i), ";");
    console.log("---"), fs.writeFileSync(t, stamp + n.join(""), "utf8");
}

var a = TEST, ptext = "/*{include ./hello.txt}*/", fs = require("fs"), jsp = require("uglify-js").parser, pro = require("uglify-js").uglify, stamp = "/*-- MinJS --*/\n";

exports.min = minBuildInOne;;