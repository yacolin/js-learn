// 定义模块math.js
var basicNum = 0;

function add(a, b) {
  return a + b;
}

function increase() {
  basicNum++;
}

export { add, basicNum, increase };
