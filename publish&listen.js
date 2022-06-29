const Event = (() => {
  const clientList = {};

  const listen = (key, fn) => {
    if (!clientList[key]) {
      clientList[key] = [];
    }
    clientList[key].push(fn);
  };

  const trigger = (type, ...args) => {
    const fns = clientList[type];
    if (!fns || fns.length === 0) {
      return false;
    }

    fns.forEach((fn) => {
      fn.apply(this, args);
    });
  };

  const remove = (type, fn) => {
    const fns = clientList[type];

    // 如果没有该类型的事件
    if (!fns || fns.length === 0) {
      return false;
    }

    // 如果不传入具体的事件，就表示取消该类型的所有事件
    if (!fn) {
      fns.length === 0;
    } else {
      for (let i = 0, len = fns.length; i < len; i++) {
        let _fn = fns[i];
        if (_fn === fn) {
          fns.splice(i, 1);
          break;
        }
      }
    }
  };

  return {
    listen,
    trigger,
    remove,
  };
})();

var obj = {
  a: 1,
  b: {
    c: 1,
    d: 0,
    e: {
      f: 1,
      g: 0,
      h: {
        i: 1,
        j: {
          k: 1,
        },
      },
    },
  },

  l: {
    m: 0,
    n: 1,
    o: 1,
    p: 1,
  },
};

[
  obj.a,
  obj.b.c,
  obj.b.e.f,
  obj.b.e.h.i,
  obj.b.e.h.j.k,
  obj.l.n,
  obj.l.o,
  obj.l.p,
];

var getPath = (obj, str, num) => {
  let arr = [];

  const traverseObj = (obj, str) => {
    for (var key in obj) {
      let _key = `${str}.${key}`;

      if (obj[key] === num) {
        arr.push(_key);
      } else {
        traverseObj(obj[key], _key);
      }
    }
  };

  traverseObj(obj, str);

  return arr;
};

setTimeout(() => {
  // 执行3s
}, 500);

setInterval(() => {
  // 执行3s
}, 500);

var obj1 = {
  a: 1,
  b: 2,
  c: 3,
};

function toParams(url, obj) {
  let arr = [];

  for (let i in obj) {
    arr.push(`${i}=${obj[i]}`);
  }

  let params = arr.join("&");

  return `${url}?${params}`;
}
