import { basicNum, add, increase } from "./math.mjs";

var result = add(2, 5);
console.log(basicNum, result);
increase();
console.log(basicNum);

// CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用。
// CommonJS 模块是运行时加载，ES6 模块是编译时输出接口。
