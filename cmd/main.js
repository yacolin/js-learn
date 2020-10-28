// CMD推崇依赖就近、延迟执行。此规范其实是在sea.js推广过程中产生的。
seajs.use(['./math.js'], function(math) {
	var sum = math.add(1, 2);
	console.log(sum);
})