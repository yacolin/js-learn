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

  // Promise.resolve('foo') 等价于 new Promise((resolve) => reoslve('foo'))
  // Promise.resolve的参数是一个Promise实例时，原封不动的返回这个实例
  // 当参数是一个 thenable 对象时，即含有 then 方法的对象时，会返回一个 Promise 对象，并立即执行 then 方法。
  // 当参数是不是一个 thenable 对象时，由于参数不是一个异步的，所以当 Promise.resolve 后，直接的状态就是 resolved 的状态，所以 then 后就会输出原值。
  // 当不传参数的时候，返回的就是一个带有 resolved 状态的 Promise 对象。
  static resolve(value) {
    return new Promise((resolve) => {
      resolve(value);
    });
  }

  // 返回一个状态为 rejected 的 Promise 对象，传入的参数作为错误信息作为后续方法传递的参数。
  // 当参数是 thenable 对象时，返回的不是 error 信息而是 thenable 对象。
  //
  static reject(value) {
    return new Promise((resolve, reject) => {
      reject(value);
    });
  }

  static race(promises) {
    return new Promise((resolve, reject) => {
      promises.map((promise) => {
        promise.then(resolve, reject);
      });
    });
  }

  static all(promises) {
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
  }
}
