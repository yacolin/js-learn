/*
 * CodingMan
 */
function CodingMan(name) {
	function Man(name) {
		setTimeout(() => {
			console.info(`Hi, this is ${name}`);
		}, 0);
	}


	Man.prototype.sleep = function(time) {
		let curTime = new Date();
		let delay = time * 1000;

		// 异步
		setTimeout(() => {
			while (new Date() - curTime <delay) {} // 阻塞当前主线程
			console.log(`Wake up after ${time}`);
		}, 0);
		return this;
	}

	Man.prototype.eat = function(type) {
		setTimeout(() => {
			console.info(`Eat ${type}~`);
		}, 0);
		return this;
	}

	Man.prototype.sleepFirst = function(time) {
		let curTime = new Date();
		let delay = time * 1000;
		while (new Date() - curTime <delay) {} // 阻塞当前主线程
		console.log(`Wake up after ${time}`);
		return this;
	}


	return new Man(name);
}


Function.prototype.next = function(fn) {
	let _this = this;

	return function() {
		let args = Array.from(arguments);
		let res = _this.apply(this, args);
		if (res === 'next') {
			return fn.apply(this, args);
		}
		return res;
	}
}

function A(score) {
	if (score >= 30) {
		return 'A';
	}
	return 'next';
}

function B(score) {
	if (score >= 20 && score < 30) {
		return 'B';
	}
	return 'next';
}

function C(score) {
	if (score >= 10 && score < 20) {
		return 'C';
	}
	return 'next';
}

function D(score) {
	if (score < 10) {
		return 'D';
	}
	return 'unknow';
}

function getComment(score) {
	return A.next(B).next(C).next(D)(score);
}



function Test(name) {
	this.task = [];
	let fn = () => {
		console.log(name);
		this.next();
	}
	this.task.push(fn);
	setTimeout(() => {
		this.next();
	}, 0);
	return this;
}

Test.prototype.sleepFirst = function(timer) {
	let that = this;
	let fn = () => {
		setTimeout(() => {
			that.next();
		}, timer * 1000);
	}
	this.task.unshift(fn);
	return this;
}

Test.prototype.sleep = function(timer) {
	let that = this;
	let fn = () => {
		setTimeout(() => {
			that.next();
		}, timer * 1000);
	}
	this.task.unshift(fn);
	return this;
}

Test.prototype.eat = function(dinner) {
	let that = this;
	let fn = () => {
		console.log(dinner);
		that.next();
	}

	this.task.unshift(fn);
	return this;
}

Test.prototype.next = function(func) {
	let fn = this.task.shift();
	fn && fn();
}