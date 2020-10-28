/*
 * 手动实现promise
 */


const PENDING = 'pending';
const RESOLVED = 'resolved';
const REJECTED = 'rejected';


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

			this.resolveCbs.map(fn => fn(this.value));
		}


		function reject(reason) {
			this.status = REJECTED;
			this.reason = reason;

			this.rejectCbs.map(fn => fn(this.reason));
		}

		executor(resolve.bind(this), reject.bind(this));
	}

	then(onFulfilled, onRejected) {
		onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => { return v };
		onRejected = typeof onRejected === 'function' ? onRejected : e => { throw e };


		function resolvePromise(promise2, x, resolve, reject) {
			if (promise2 === x) {
				// 不允许promise2 === x 避免自己等于自己
				return reject(new TypeError('Chanining cycle detected for promise'));
			}

			// 防止重复调用
			let called = false;

			try {
				if (x instanceof Promise) {
					let then = x.then;

					// 第一个参数指定调用对象
					// 第二个参数为成功的回调，将结果作为resolvePromise的参数进行递归
					// 第三个参数为失败的回调
					then.call(x, y=> {
						if (called) return;
						called = true;

						// resolve的结果依旧是Promise那就继续解析
						resolvePromise(promise2, y, resolve, reject);
					}, err => {
						if (called) return;
						called = true;
						reject(err);
					})
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
				}, 0)
			}

			function rejected() {
				setTimeout(() => {
					let x = onRejected(this.reason);
					resolvePromise(promise2, x, resolve, reject);
				}, 0)
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
		})

		return promise2;
	}


	catch(fn) {
		this.then(null, fn);
	}


	static resolve(value) {
		return new Promise(resolve => {
			resolve(value);
		})
	}

	static reject(value) {
		return new Promise((resolve, reject) => {
			reject(value);
		})
	}

	static race(promises) {
		return new Promise((resolve, reject) => {
			promises.map(promise => {
				promise.then(resolve, reject);
			});
		});
	}

	static all(promises) {
		let arr = [];
		let i  = 0;

		return new Promise((resolve, reject) => {
			promises.map((promise, index) => {
				promise.then(data => {
					arr[index] = data;
					if (++i === promises.length) {
						resolve(arr);
					}
				}, reject);
			})
		})
	}
}