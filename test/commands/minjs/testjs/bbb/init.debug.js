define(function(require, exports, module) {
	require("html5shim");
	require("css/home.css");
	module.exports = {
		start: function() {
			var $ = require("$");
			$("h1").click(function() {
				var $this = $(this);
				require.async("/test/data.html#", function(text) {
					$this.html(text);
				});
			});
		}
	};
});
