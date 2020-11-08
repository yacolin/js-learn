// Node.js是commonJS规范的主要实践者，
// 它有四个重要的环境变量为模块化的实现提供支持：module、exports、require、global。
// 实际使用时，用module.exports定义当前模块对外输出的接口（不推荐直接用exports），用require加载模块。

// 定义模块math.js
var basicNum = 0;

function add(a, b) {
  return a + b;
}

function increase() {
  basicNum++;
}

var obj = {
  a: 1,
  b: {
    c: 2,
  },
};

function change() {
  obj.b.c = 3;
}

// 写上需要对外暴露的函数变量
module.exports = {
  basicNum: basicNum,
  obj: obj,
  add: add,
  increase: increase,
  change: change,
};
