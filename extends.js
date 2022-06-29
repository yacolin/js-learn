function Father(props) {
  this.name = props && props.name;
}

Father.prototype.getName = function () {
  return this.name;
};

function Son(...rest) {
  Father.apply(this, rest);
}

function Middle() {}

Middle.prototype = Father.prototype;

Son.prototype = new Middle();

Son.prototype.constructor = Son;

// 父类本身的属性由子类本身继承
// 父类原型对象上的属性由子类原型对象继承
// 需要搞个中间类，把父类的原型属性拷贝过来
// 拷贝过来以后构造器指向会变
// 所以最后修改指向是自己

// 寄生组合式继承
function Parent(name, age) {
  this.name = name;
  this.age = age;
}
function Child() {
  Parent.apply(this);
}

Child.prototype = Object.create(Parent.prototype);
Child.prototype.constructor = Child;

// 实现call
Function.prototype.call = function (ctx, ...args) {
  let caller = undefined;
  let res = undefined;

  try {
    ctx = ctx || window;
    caller = Symbol("caller");
    ctx[caller] = this;
    res = ctx[caller](...args);
    delete ctx[caller];
  } catch (e) {}

  return res;
};

// 实现apply
Function.prototype.apply = function (ctx, args) {
  let caller = undefined;
  let res = undefined;

  try {
    ctx = ctx || window;
    caller = Symbol("caller");
    ctx[caller] = this;
    args = args ? args : [];
    res = ctx[caller](...args);
    delete ctx[caller];
  } catch (error) {}

  return res;
};

// 实现bind
Function.prototype.bind = function (fn, thisArg) {
  return function () {
    fn.apply(thisArg, arguments);
  };
};
