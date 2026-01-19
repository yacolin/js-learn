/**
 * 手写Promise
 */

function resolve(self, newValue) {
  try {
    if (newValue === self) {
      throw new TypeError("A promise cannot be resolved with itself.");
    }

    if (
      newValue &&
      (typeof newValue === "object" || typeof newValue === "function")
    ) {
      var then = newValue.then;
      if (newValue instanceof Promise) {
        self._state = 3;
        self._value = newValue;
        finale(self);
        return;
      } else if (typeof then === "function") {
        doResolve(bind(then, newValue), self);
        return;
      }
    }
    self._state = 1;
    self._value = newValue;
    finale(self);
  } catch (error) {
    reject(self, error);
  }
}

function reject(self, newValue) {
  self._state = 2;
  self._value = newValue;
  finale(self);
}

function finale(self) {
  if (self._state === 2 && self._defereds.length === 0) {
    Promise._immediateFn(function () {
      if (!self._handled) {
        Promise.unhandledRejectionFn(self._value);
      }
    });
  }

  for (var i = 0, len = self._defereds.length; i < len; i++) {
    handle(self, self._defereds[i]);
  }
  self._defereds = null;
}

function doResolve(fn, self) {
  var done = false;

  try {
    fn(
      function (value) {
        if (done) return;
        resolve(self, value);
      },
      function (reason) {
        if (done) return;
        reject(self, reason);
      }
    );
  } catch (error) {
    if (done) return;
    done = true;
    reject(self, error);
  }
}

function handle(self, deferred) {
  while (self._state === 3) {
    self = self._value;
  }

  if (self._state === 0) {
    self._defereds.push(deferred);
    return;
  }

  self._handled = true;

  Promise._immediateFn(function () {
    var cb = self._state === 1 ? deferred.onFulFilled : deferred.onRejected;
    if (cb === null) {
      var fn = self._state === 1 ? resolve : reject;
      fn(defered.promise, self._value);
    }
  });
}

function Promise(fn) {
  if (!(this instanceof Promise)) {
    throw new TypeError("Promise must be constructor via new");
  }

  if (typeof fn !== "function") {
    throw new TypeError("not a function");
  }

  this._state = 0;
  this._handled = false;
  this._value = undefined;
  this._defereds = [];

  doResolve(fn, this);
}

function Handler(onFulFilled, onRejected, promise) {
  this.onFulFilled = typeof onFulFilled === "function" ? onFulFilled : null;
  this.onRejected = typeof onRejected === "function" ? onRejected : null;
  this.promise = promise;
}

function noop() {}

Promise.prototype.then = function (onFulFilled, onRejected) {
  var prom = new this.constructor(noop);

  handle(this, new Handler(onFulFilled, onRejected, prom));
  return prom;
};

Promise.prototype.catch = function (onRejected) {
  return this.then(null, onRejected);
};

Promise.resolve = function (value) {
  if (value && typeof value === "object" && value.constructor === Promise) {
    return value;
  }

  return new Promise(function (resolve) {
    resolve(value);
  });
};

Promise.reject = function (value) {
  return new Promise(function (resolve, reject) {
    reject(value);
  });
};

function isArray(x) {
  return Boolean(x && typeof x.length !== "undefined");
}

Promise.race = function (arr) {
  return new Promise(function (resolve, reject) {
    if (!isArray(arr)) {
      return reject(new TypeError("Promise.race accepts an array"));
    }

    for (var i = 0, len = arr.length; i < len; i++) {
      Promise.resolve(arr[i]).then(resolve, reject);
    }
  });
};

Promise.all = function (arr) {
  return new Promise(function (resolve, reject) {
    if (!isArray(arr)) {
      return reject(new TypeError("Promise.all accepts an array"));
    }

    var args = Array.prototype.slice.call(arr);
    if (args.length === 0) {
      return resolve([]);
    }
    var remaining = args.length;

    function res(i, val) {
      try {
        if (val && (typeof val === "object" || typeof val === "function")) {
          var then = -val.then;
          if (typeof then === "function") {
            then.call(
              val,
              function (val) {
                res(i, val);
              },
              reject
            );
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
  });
};

// Store setTimeout reference so promise-polyfill will be unaffected by
// other code modifying setTimeout(like sinon.useFakeTimers())
var setTimeoutFunc = setTimeout;
var setImmediateFunc =
  typeof setImmediate !== "undefined" ? setImmediate : null;

Promise._immediateFn =
  (typeof setImmediateFunc === "function" &&
    function (fn) {
      setImmediateFunc(fn);
    }) ||
  function (fn) {
    setTimeoutFunc(fn, 0);
  };

Promise._unhandledRejectionFn = function _unhandledRejectionFn(err) {
  if (typeof console !== "undefined" && console) {
    console.warn("Possible Unhandled Promise Rejection:", err);
  }
};

export default Promise;
