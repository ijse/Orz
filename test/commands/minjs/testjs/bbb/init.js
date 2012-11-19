/*-- MinJS at [Sun Nov 18 2012 20:07:48 GMT+0800 (中国标准时间)] --*/
define(function(require, exports, module) {
    require("html5shim"), require("css/home.css"), module.exports = {
        start: function() {
            var e = require("$");
            e("h1").click(function() {
                var t = e(this);
                require.async("/test/data.html#", function(e) {
                    t.html(e);
                });
            });
        }
    };
});;