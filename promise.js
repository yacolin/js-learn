/*
 * 手动实现promise
 */

const PENDING = "pending";
const RESOLVED = "resolved";
const REJECTED = "rejected";

class Promise {
  constructor(executor) {
    this.status = PENDING;
    this.value = null;
    this.reason = null;
    this.resolveCbs = [];
    this.rejectCbs = [];

    function resolve(value) {
      this.status = RESOLVED;
      this.value = value;

      this.resolveCbs.map((fn) => fn(this.value));
    }

    function reject(reason) {
      this.status = REJECTED;
      this.reason = reason;

      this.rejectCbs.map((fn) => fn(this.reason));
    }

    executor(resolve.bind(this), reject.bind(this));
  }

  then(onFulfilled, onRejected) {
    onFulfilled =
      typeof onFulfilled === "function"
        ? onFulfilled
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
              called = true;
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
          let x = onFulfilled(this.value);
          resolvePromise(promise2, x, resolve, reject);
        }, 0);
      }

      function rejected() {
        setTimeout(() => {
          let x = onRejected(this.reason);
          resolvePromise(promise2, x, resolve, reject);
        }, 0);
      }

      if (this.status === RESOLVED) {
        fulfilled.call(this);
      }

      if (this.status === REJECTED) {
        rejected.call(this);
      }

      if (this.status === PENDING) {
        this.resolveCbs.push(fulfilled.bind(this));
        this.rejectCbs.push(rejected.bind(this));
      }
    });

    return promise2;
  }

  catch(fn) {
    this.then(null, fn);
  }

  // Promise.resolve('foo') 等价于 new Promise((resolve) => resolve('foo'))
  // Promise.resolve的参数是一个Promise实例时，原封不动的返回这个实例
  // 当参数是一个 thenable 对象时，即含有 then 方法的对象时，会返回一个 Promise 对象，并立即执行 then 方法。
  // 当参数是不是一个 thenable 对象时，由于参数不是一个异步的，所以当 Promise.resolve 后，直接的状态就是 resolved 的状态，所以 then 后就会输出原值。
  // 当不传参数的时候，返回的就是一个带有 resolved 状态的 Promise 对象。
  static resolve(value) {
    if (value && typeof value === "object" && value.constructor === Promise) {
      return value;
    }

    return new Promise((resolve) => {
      resolve(value);
    });
  }

  // 返回一个状态为 rejected 的 Promise 对象，传入的参数作为错误信息作为后续方法传递的参数。
  // 当参数是 thenable 对象时，返回的不是 error 信息而是 thenable 对象。
  static reject(value) {
    return new Promise((resolve, reject) => {
      reject(value);
    });
  }

  static race(promises) {
    return new Promise((resolve, reject) => {
      if (!Array.isArray(promises)) {
        return reject(new TypeError("Promise.race accepts an array"));
      }
      promises.forEach((promise) => {
        Promise.resolve(promise).then(resolve, reject);
      });
    });
  }

  static all(promises) {
    return new Promise((resolve, reject) => {
      if (!Array.isArray(promises)) {
        return reject(new TypeError("Promise.all accepts an array"));
      }

      let args = Array.prototype.slice.call(promises);
      if (args.length === 0) {
        return resolve([]);
      }

      let remaining = args.length;
      const res = (i, val) => {
        try {
          if (val && (typeof val === "object" || typeof val === "function")) {
            var then = val.then;
            if (typeof then === "function") {
              then.call(
                val,
                (val) => {
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
      };

      args.forEach((arg, i) => {
        res(i, arg);
      });
    });
  }

  static allSettled(promises) {
    return new Promise((resolve, reject) => {
      if (!Array.isArray(promises)) {
        return reject(
          new TypeError(
            typeof promises +
              " " +
              promises +
              " is not iterable(cannot read property Symbol(Symbol.iterator))"
          )
        );
      }

      let args = Array.prototype.slice.call(promises);
      if (args.length === 0) {
        return resolve([]);
      }

      let remaining = args.length;
      const res = (i, val) => {
        if (val && (typeof val === "object" || typeof val === "function")) {
          var then = val.then;
          if (typeof then === "function") {
            then.call(
              val,
              (val) => {
                res(i, val);
              },
              (reason) => {
                args[i] = { status: "rejected", reason };
                if (--remaining === 0) {
                  resolve(args);
                }
              }
            );
            return;
          }
        }

        args[i] = { status: "fulfilled", value: val };
        if (--remaining === 0) {
          resolve(args);
        }
      };

      args.forEach((arg, i) => {
        res(i, arg);
      });
    });
  }

  static finally(callback) {
    return this.then(
      (data) => Promise.resolve(callback()).then(() => data),
      (reason) =>
        Promise.resolve(callback).then(() => {
          return Promise.reject(reason);
        })
    );
  }
}
