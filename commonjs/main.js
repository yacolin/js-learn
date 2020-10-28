// 引用自定义的模块时，参数包含路径，可省略.js
var math = require('./math');
var result = math.add(2, 5);

console.log(result, math.basicNum);

// commonJS用同步的方式加载模块。在服务端，模块文件都存在本地磁盘，读取非常快，所以这样做不会有问题。
// 但是在浏览器端，限于网络原因，更合理的方案是使用异步加载。