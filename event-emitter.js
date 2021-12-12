/** global WeakMap */
const privateMap = new WeakMap();

// For making private properties.
function internal(obj) {
  if (!privateMap.has(obj)) {
    privateMap.set(obj, {});
  }

  return privateMap.get(obj);
}

// Excluding callbacks from internal(_callbacks) for speed performance.
let _callbacks = {};

/** Class EventEmitter for event-driven architecture. */
export default class EventEmitter {
  /**
   * Constructor.
   *
   *
   * @constructor
   * @param {number|null} maxListeners
   * @param {object} localConsole
   *
   * Set private initial parameters:
   *  _events, _callbacks, _maxListeners, _console.
   *
   * @returns {this}
   */
  constructor(maxListeners = null, localConsole = console) {
    const self = internal(this);

    self._events = new Set();
    self._console = localConsole;
    self._maxListeners =
      maxListeners === null ? null : parseInt(maxListeners, 10);

    return this;
  }

  /**
   *
   * @param {string} eventName
   * @param {function} callback
   * @param {object|null} context - In than context will be called callback.
   * @param {number} weight - Using for sorting callbacks calls
   *
   * @returns {this}
   */
  _addCallback(eventName, callback, context, weight) {
    this._getCallbacks(eventName).push({
      callback,
      context,
      weight,
    });

    // Sort the array of callbacks in
    // the order fo their call by "weight".
    this._getCallbacks(eventName).sort((a, b) => b.weight - a.weight);

    return this;
  }

  /**
   * Get all callback for the event.
   *
   * @param {string} eventName
   *
   * @returns {object|undefined}
   */
  _getCallbacks(eventName) {
    return _callbacks[eventName];
  }

  /**
   * Get callback's index for the event.
   *
   * @param {string} eventName
   * @param {callback} callback
   *
   * @returns {number|null}
   */
  _getCallbacksIndex(eventName, callback) {
    return this._has(eventName)
      ? this._getCallbacks(eventName).findIndex(
          (element) => element.callback === callback
        )
      : -1;
  }

  /**
   *
   * @param {string} eventName
   *
   * @returns {bool}
   */
  _achieveMaxListener(eventName) {
    return (
      internal(this)._maxListeners !== null &&
      internal(this)._maxListeners <= this.listenersNumbers(eventName)
    );
  }

  /**
   * Check if callback is already exists for the event.
   *
   * @param {string} eventName
   * @param {function} callback
   * @param {object|null} context - In than context will be called callback.
   *
   * @returns {bool}
   */
  _callbackIsExists(eventName, callback, context) {
    const callbackInd = this._getCallbacksIndex(eventName, callback);
    const activeCallback =
      callbackInd !== -1 ? this._getCallbacks(eventName)[callbackInd] : void 0;

    return (
      callbackInd !== -1 && activeCallback && activeCallback.context === context
    );
  }

  /**
   * Check is the event was already added.
   *
   * @param {string} eventName
   *
   * @returns {bool}
   */
  _has(eventName) {
    return internal(this)._events.has(eventName);
  }

  /**
   *
   * @param {string} eventName
   *
   * @returns {number|null} - Number of listeners for event
   *                          or null if event isn't exists.
   */
  listenersNumbers(eventName) {
    return this._has(eventName) ? _callbacks[eventName].length : null;
  }

  /**
   * Add the listeners.
   *
   * @param {string} eventName
   * @param {function} callback
   * @param {object|nll} context - In than context will be called callback.
   * @param {*} weight - Using for sorting callbacks calls.
   *
   * @returns {this}
   */
  on(eventName, callback, context = null, weight = 1) {
    const self = internal(this);

    if (typeof callback !== "function") {
      throw new TypeError(`${callback} is not a function`);
    }

    // If event wasn't added before - just add it
    // and define callbacks as an empty object.
    if (!this._has(eventName)) {
      self._events.add(eventName);
      _callbacks[eventName] = [];
    } else {
      // Check if we reached maximum number of listeners.
      if (this._achieveMaxListener(eventName)) {
        self._console.warn(
          `Max listeners (${self._maxListeners}) for event "${eventName}" is reached!`
        );
      }

      // Check if the same callback has already added.
      if (this._callbackIsExists(...arguments)) {
        self._console.warn(
          `Event "${eventName}" alread has the callback ${callback}.`
        );
      }
    }

    this._addCallback(...arguments);

    return this;
  }

  /**
   * Add the listeners which will be executed only once.
   *
   * @param {string} eventName
   * @param {function} callback
   * @param {object|nll} context - In than context will be called callback.
   * @param {*} weight - Using for sorting callbacks calls.
   *
   * @returns {this}
   */
  once(eventName, callback, context = null, weight = 1) {
    const onceCallback = (...args) => {
      this.off(eventName, onceCallback);
      return callback.call(context, args);
    };

    return this.on(eventName, onceCallback, context, weight);
  }

  /**
   * Remove an event at all or just remove selected callback from the event.
   *
   * @param {string} eventName
   * @param {function} callback
   *
   * @returns {this}
   */
  off(eventName, callback = null) {
    const self = internal(this);
    let callbackInd;

    if (this._has(eventName)) {
      if (callback === null) {
        // Remove the event.
        self._events.delete(eventName);
        // Remove all listeners.
        _callbacks[eventName] = null;
      } else {
        callbackInd = this._getCallbacksIndex(eventName, callback);

        if (callbackInd !== -1) {
          this._getCallbacks(eventName).splice(callbackInd, 1);
          // Remove all equal callbacks.
          this.off(...arguments);
        }
      }
    }

    return this;
  }

  /**
   * Trigger the event.
   *
   * @param {string} eventName
   * @param {...args} args - All arguments which should be passed into callbacks.
   *
   * @returns {this}
   */
  emit(eventName /* , ...args */) {
    // if (this._has(eventName)) {
    //   this._getCallbacks(eventName).forEach((element) =>
    //     element.callback.call(element.context, args)
    //   );
    // }

    // It works ~3 times faster.
    const custom = _callbacks[eventName];

    // Number of callbacks.
    let i = custom ? custom.length : 0;
    let len = arguments.length;
    let args;
    let current;

    if (i > 0 && len > 1) {
      args = new Array(len - 1);

      while (len--) {
        if (len === 1) {
          // We do not need first argument.
          break;
        }
        args[len] = arguments[len];
      }
    }

    while (i--) {
      current = custom[i];

      if (arguments.length > 1) {
        current.callback.call(current.context, args);
      } else {
        current.callback.call(current.context);
      }
    }

    // Just clean it
    args = null;

    return this;
  }

  /**
   * Clear all events and callback links.
   *
   * @returns {this}
   */
  clear() {
    internal(this)._events.clear();
    _callbacks = {};

    return this;
  }
}
