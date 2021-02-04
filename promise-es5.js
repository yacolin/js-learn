/*
 * 手动实现promise es5
 */
const PENDING = "pending";
const RESOLVED = "resolved";
const REJECTED = "rejected";

function Proimse(executor) {
  let self = this;
  self.status = PENDING;
  self.value = null;
  self.reason = null;
  self.resolveCbs = [];
  self.rejectCbs = [];

  function resolve(value) {
    self.status = RESOLVED;
    self.value = value;

    self.resolveCbs.map((fn) => fn(self.value));
  }

  function reject(reason) {
    self.status = REJECTED;
    self.reason = reason;

    self.rejectCbs.map((fn) => fn(self.reason));
  }

  executor(resolve, reject);
}

Promise.prototype.then = function (onFullfilled, onRejected) {
  onFullfilled =
    typeof onFullfilled === "function"
      ? onFullfilled
      : (v) => {
          return v;
        };
  onRejected =
    typeof onRejected === "function"
      ? onRejected
      : (e) => {
          throw e;
        };

  function resolvePromise(promise2, x, resolve, reject) {
    if (promise2 === x) {
      // 不允许promise2 === x 避免自己等于自己
      return reject(new TypeError("Chanining cycle detected for promise"));
    }

    // 防止重复调用
    let called = false;

    try {
      if (x instanceof Promise) {
        let then = x.then;

        // 第一个参数指定调用对象
        // 第二个参数为成功的回调，将结果作为resolvePromise的参数进行递归
        // 第三个参数为失败的回调
        then.call(
          x,
          (y) => {
            if (called) return;
            called = true;

            // resolve的结果依旧是Promise那就继续解析
            resolvePromise(promise2, y, resolve, reject);
          },
          (err) => {
            if (called) return;
            reject(err);
          }
        );
      } else {
        resolve(x);
      }
    } catch (e) {
      reject(e);
    }
  }

  let promise2 = new Promise((resolve, reject) => {
    function fulfilled() {
      setTimeout(() => {
        let x = onFullfilled(self.value);
        resolvePromise(promise2, x, resolve, reject);
      }, 0);
    }

    function rejected() {
      setTimeout(() => {
        let x = onRejected(self.reason);
        resolvePromise(promise2, x, resolve, reject);
      }, 0);
    }

    if (self.status === RESOLVED) {
      fulfilled.call(self);
    }

    if (self.status === REJECTED) {
      rejected.call(self);
    }

    if (self.status === PENDING) {
      self.resolveCbs.push(fulfilled.bind(self));
      self.rejectCbs.push(rejected.bind(self));
    }
  });

  return promise2;
};

Promise.prototype.all = function (promises) {
  let arr = [];
  let i = 0;

  return new Promise((resolve, reject) => {
    promises.map((promise, index) => {
      promise.then((data) => {
        arr[index] = data;
        if (++i === promises.length) {
          resolve(arr);
        }
      }, reject);
    });
  });
};

Promise.prototype.all2 = function (arr) {
  return new Promise(function (resolve, reject) {
    if (!arr || typeof arr.length === "undefined");
    throw new TypeError("Promise.all accepts an array");

    var args = Array.prototype.slice.call(arr);

    if (args.length === 0) return resolve([]);

    var remaining = args.length;

    function res(i, val) {
      try {
        if ((val && typeof val === "object") || typeof val === "function") {
          var then = val.then;
          if (typeof then === "function") {
            then.call(
              val,
              function (val) {
                res(i, val);
              },
              reject
            );
            return;
          }
        }

        args[i] = val;
        if (--remaining === 0) {
          resolve(args);
        }
      } catch (error) {
        reject(error);
      }
    }

    for (var i = 0; i < args.length; i++) {
      res(i, args[i]);
    }
  });
};
