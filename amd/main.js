// AMD（Asynchronous Module Definition） 推崇依赖前置、提前执行
// AMD规范采用异步方式加载模块，模块的加载不影响它后面语句的运行。
// 所有依赖这个模块的语句，都定义在一个回调函数中，等到加载完成之后，这个回调函数才会运行
require.config({
	baseUrl: "https://cdnjs.cloudflare.com/ajax/libs/",
	paths: {
		jquery:"jquery/3.6.0/jquery.min",
		underscore: "underscore.js/1.13.2/underscore-min"
	}
});

require(["jquery", "underscore"], function($, _) {
	$("#test").html('12345')
})
