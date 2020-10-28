// AMD 推崇依赖前置、提前执行
// AMD规范采用异步方式加载模块，模块的加载不影响它后面语句的运行。
// 所有依赖这个模块的语句，都定义在一个回调函数中，等到加载完成之后，这个回调函数才会运行
require.config({
	baseUrl: "https://cdn.bootcdn.net/ajax/libs/",
	paths: {
		jquery:"jquery/3.5.1/jquery.min",
		underscore: "underscore.js/1.11.0/underscore-esm-min.min"
	}
});

require(["jquery", "underscore"], function($, _) {
	$("#test").html('12345')
})
