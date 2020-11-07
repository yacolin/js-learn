/*
 * @Author: xjq
 * @Date: 2020-11-07 14:58:22
 * @LastEditors: xjq
 * @LastEditTime: 2020-11-07 15:25:05
 * @Description: 深拷贝 浅拷贝
 * @FilePath: \js-learn\shallow&deepClone\main.js
 */
function shallowClone(target) {
  let cloneTarget = {};

  for (const key in target) {
    cloneTarget[key] = target[key];
  }

  return cloneTarget;
}

function deepClone(target, map = new WeakMap()) {
  if (typeof target === "object") {
    let cloneTarget = Array.isArray(target) ? [] : {};

    if (map.get(target)) {
      return map.get(target);
    }
    map.set(target, cloneTarget);

    for (const key in target) {
      cloneTarget[key] = deepClone(target[key], map);
    }
    return cloneTarget;
  } else {
    return target;
  }
}

const target = {
  field1: 1,
  field2: undefined,
  field3: "ConardLi",
  field4: {
    child: "child",
    child2: {
      child2: "child2",
    },
  },
};

const target2 = {
  field1: 1,
  field2: undefined,
  field3: {
    child: "child",
  },
  field4: [2, 4, 8],
};

const target3 = {
  field1: 1,
  field2: undefined,
  field3: {
    child: "child",
  },
  field4: [2, 4, 8],
};
target3.target = target3;

let ret = deepClone(target3);
console.log(ret);
