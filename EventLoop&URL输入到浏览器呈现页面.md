
---
### **1. 浏览器地址栏输入 URL 到页面呈现，经历了哪些过程？**

#### **(1) 用户输入 URL 并回车**
- 浏览器会判断输入的是合法 URL 还是搜索关键词（如 Chrome 会自动补全或跳转到搜索引擎）。

#### **(2) DNS 解析（Domain Name System）**
- 将域名（如 `www.example.com`）解析为对应的 IP 地址。
- 查询顺序：浏览器缓存 → 系统缓存（hosts 文件）→ 路由器缓存 → ISP DNS 服务器 → 根域名服务器（递归查询）。

#### **(3) 建立 TCP 连接（三次握手）**
- 使用解析出的 IP 和端口（默认 HTTP 是 80，HTTPS 是 443）建立 TCP 连接。
- 如果是 HTTPS，还需进行 TLS 握手（加密通道建立）。

#### **(4) 发送 HTTP 请求**
- 浏览器构造 HTTP 请求报文（包含请求方法、Header、Body 等），通过已建立的连接发送给服务器。

#### **(5) 服务器处理请求并返回响应**
- 服务器接收请求，处理逻辑（如查询数据库、调用 API），生成 HTML 响应。
- 返回 HTTP 响应（状态码、响应头、响应体等）。

#### **(6) 浏览器接收响应并开始解析**
- 若响应头中包含重定向（如 301/302），则重复上述流程。
- 否则，浏览器开始解析 HTML 文档。

#### **(7) 构建 DOM 树（Document Object Model）**
- HTML 解析器将 HTML 字符串转换成 DOM 节点树。

#### **(8) 构建 CSSOM 树（CSS Object Model）**
- 遇到 `<link>` 或 `<style>` 时，下载并解析 CSS，构建 CSSOM。
- **注意**：CSS 加载会阻塞渲染（但不会阻塞 DOM 解析）。

#### **(9) 构建 Render Tree（渲染树）**
- 将 DOM 和 CSSOM 合并，形成 Render Tree（只包含可见元素，如 `display: none` 的元素不会包含）。

#### **(10) Layout（布局 / 回流）**
- 计算每个节点在视口中的确切位置和大小（几何信息）。

#### **(11) Paint（绘制）**
- 将 Render Tree 中的每个节点转换为屏幕上的像素（颜色、边框、阴影等）。

#### **(12) Composite（合成）**
- 若页面包含多个图层（如使用 `transform`、`will-change` 等），浏览器会分层绘制，再合成最终画面。

#### **(13) 执行 JavaScript**
- 遇到 `<script>` 标签时：
  - 如果是**同步脚本**（无 `async`/`defer`），会**阻塞 HTML 解析**，立即下载并执行。
  - `defer`：延迟到 DOM 解析完成后、`DOMContentLoaded` 事件前执行。
  - `async`：异步下载，下载完成后立即执行（可能在 DOM 解析完成前）。
- JS 可能会修改 DOM/CSSOM，触发重新构建 Render Tree、Layout、Paint。

#### **(14) 页面加载完成**
- 当所有资源（HTML、CSS、JS、图片等）加载完毕，触发 `window.onload` 事件。

> ✅ **关键点总结**：
> - DNS → TCP → HTTP → 解析 HTML → 构建 DOM/CSSOM → Render Tree → Layout → Paint → Composite
> - 关键渲染路径（Critical Rendering Path）决定了首屏速度
> - JS 和 CSS 对渲染的影响（阻塞/非阻塞）

---

### **2. JavaScript Event Loop 详细说说**

Event Loop（事件循环）是 JavaScript 实现**异步编程**的核心机制。由于 JS 是单线程语言，它通过 Event Loop 来协调同步任务与异步任务的执行。

#### **(1) 调用栈（Call Stack）**
- JS 代码执行时，函数会被压入调用栈；执行完后弹出。
- 如果调用栈阻塞（如死循环），整个程序会“卡死”。

#### **(2) 任务队列（Task Queues）**
JS 中的任务分为两类：

| 类型 | 名称 | 特点 |
|------|------|------|
| **宏任务（Macrotask）** | script 整体代码、`setTimeout`、`setInterval`、I/O、UI 渲染等 | 每次 Event Loop 只执行一个 |
| **微任务（Microtask）** | `Promise.then/catch/finally`、`queueMicrotask`、`MutationObserver`、`process.nextTick`（Node.js） | 在当前宏任务结束后、下一个宏任务前**全部清空** |

#### **(3) Event Loop 执行流程**
1. 执行全局 script（作为第一个宏任务）
2. 执行过程中遇到：
   - 同步代码 → 直接入调用栈执行
   - 异步宏任务（如 `setTimeout`）→ 回调放入宏任务队列
   - 异步微任务（如 `Promise.then`）→ 回调放入微任务队列
3. 当前宏任务执行完毕后：
   - **清空所有微任务队列**（依次执行）
4. 微任务执行完后，可能进行 UI 渲染（浏览器环境）
5. 从宏任务队列中取出**下一个**宏任务，重复上述过程

#### **(4) 示例分析**
```js
console.log('1');

setTimeout(() => console.log('2'), 0);

Promise.resolve().then(() => console.log('3'));

console.log('4');
```

**输出顺序**：`1 → 4 → 3 → 2`

- `1` 和 `4` 是同步代码
- `Promise.then` 是微任务，在当前宏任务结束后立即执行
- `setTimeout` 是宏任务，要等下一轮 Event Loop

#### **(5) Node.js 与浏览器的差异**
- 浏览器：微任务在每个宏任务后清空
- Node.js（旧版本）：有多个阶段（timers、poll、check 等），`process.nextTick` 优先级高于 Promise
- Node.js 11+ 后行为趋近于浏览器

#### **(6) 关键总结**
- JS 是单线程，靠 Event Loop 实现“并发”
- **微任务优先级 > 宏任务**
- 不要滥用 `setTimeout(fn, 0)`，它不能替代微任务
- 长时间运行的同步任务会阻塞 Event Loop，导致页面卡顿

---

下面是对 **宏任务（Macrotask）** 与 **微任务（Microtask）** 的详细解析，涵盖定义、常见类型、执行机制、优先级、示例对比，以及在浏览器和 Node.js 中的差异。

---

## 🧩 一、基本概念

### ✅ 宏任务（Macrotask）
- 是 JavaScript 引擎或宿主环境（如浏览器、Node.js）调度的**大粒度任务单元**。
- 每次 Event Loop **只执行一个**宏任务。
- 执行完一个宏任务后，会清空当前所有的微任务，再进入下一个宏任务。

### ✅ 微任务（Microtask）
- 是在**当前宏任务结束后、下一个宏任务开始前**立即执行的任务。
- 微任务队列会在**每个宏任务结束时被完全清空**（即“全部执行完”）。
- 优先级**高于**宏任务。

> 💡 简单记忆：  
> **“宏任务 → 微任务 → 渲染 → 下一个宏任务”**

---

## 📋 二、常见类型对比

| 类型 | 宏任务（Macrotask） | 微任务（Microtask） |
|------|---------------------|---------------------|
| **浏览器中** | - `script`（整体代码块）<br>- `setTimeout` / `setInterval`<br>- `setImmediate`（仅 IE/旧版 Edge）<br>- I/O 操作<br>- UI 事件（点击、滚动等）<br>- `requestAnimationFrame`（部分观点认为属于特殊宏任务） | - `Promise.then` / `.catch` / `.finally`<br>- `queueMicrotask()`<br>- `MutationObserver`<br>- `Object.observe`（已废弃） |
| **Node.js 中** | - `setTimeout` / `setInterval`<br>- I/O callbacks<br>- `setImmediate` | - `Promise` 回调<br>- `process.nextTick()`（⚠️ **优先级比 Promise 更高！**）<br>- `queueMicrotask()` |

> ⚠️ 注意：  
> 在 Node.js 中，`process.nextTick()` 虽然常被归为微任务，但它的执行时机**早于其他微任务**，是在当前操作完成后、事件循环继续之前立即执行。

---

## 🔁 三、Event Loop 执行流程（浏览器）

1. **从宏任务队列取出第一个任务执行**（如全局 script）
2. 执行过程中：
   - 遇到同步代码 → 直接执行
   - 遇到 `setTimeout` → 回调放入**宏任务队列**
   - 遇到 `Promise.then` → 回调放入**微任务队列**
3. 当前宏任务执行完毕后：
   - **依次执行所有微任务**（直到微任务队列为空）
4. （可选）浏览器进行**UI 渲染**（如重排、重绘）
5. 从宏任务队列取**下一个宏任务**，重复上述过程

> 🔄 这个过程不断循环，称为 **Event Loop**

---

## 🧪 四、经典示例分析

### 示例 1：基础顺序
```js
console.log('A');

setTimeout(() => console.log('B'), 0);

Promise.resolve().then(() => console.log('C'));

console.log('D');
```

**执行顺序**：  
`A → D → C → B`

- `A`, `D`：同步代码
- `Promise.then`：微任务，在当前宏任务（script）结束后立即执行
- `setTimeout`：宏任务，等到下一轮 Event Loop

---

### 示例 2：嵌套微任务
```js
setTimeout(() => console.log('1'), 0);

Promise.resolve().then(() => {
  console.log('2');
  Promise.resolve().then(() => console.log('3'));
});

Promise.resolve().then(() => console.log('4'));
```

**输出**：`2 → 4 → 3 → 1`

- 微任务队列初始：[then2, then4]
- 执行 then2 时，又添加了 then3 → 微任务队列变为 [then4, then3]
- 所有微任务执行完后，才轮到 setTimeout（宏任务）

> ✅ 微任务在执行过程中**可以动态添加新的微任务**，这些新任务也会在本轮清空！

---

### 示例 3：Node.js 中的 `process.nextTick`
```js
setTimeout(() => console.log('timeout'), 0);

Promise.resolve().then(() => console.log('promise'));

process.nextTick(() => console.log('nextTick'));
```

**在 Node.js 中输出**：  
`nextTick → promise → timeout`

- `process.nextTick` 优先级 > `Promise`
- 两者都属于“本轮宏任务结束后的回调”，但 `nextTick` 最先执行

---

## 🖥️ 五、浏览器 vs Node.js 差异总结

| 特性 | 浏览器 | Node.js |
|------|--------|--------|
| 微任务队列 | `Promise.then`, `queueMicrotask`, `MutationObserver` | `Promise.then`, `queueMicrotask`, **`process.nextTick`（更高优先级）** |
| 宏任务队列 | `setTimeout`, `setInterval`, UI 事件等 | `setTimeout`, `setInterval`, I/O, `setImmediate` |
| Event Loop 阶段 | 较简单：宏任务 → 微任务 → 渲染 | 复杂：timers → I/O callbacks → idle/prepare → poll → check → close |
| `setImmediate` vs `setTimeout(fn, 0)` | 不支持 `setImmediate` | `setImmediate` 在 check 阶段，通常比 `setTimeout` 快（但不绝对） |

> 📌 注意：Node.js 11+ 后，Event Loop 行为向浏览器靠拢，但在某些边界情况仍有差异。

---

## ✅ 六、面试高频考点总结

1. **微任务一定在宏任务之前执行吗？**  
   → 是的，在**同一个 Event Loop 周期**内，微任务总是在当前宏任务结束后、下一个宏任务开始前执行。

2. **Promise 是异步的吗？**  
   → `new Promise(executor)` 中的 executor 是**同步执行**的；`.then/.catch` 回调是**异步微任务**。

3. **为什么不用 `setTimeout(fn, 0)` 实现“立即异步”？**  
   → 因为它属于宏任务，延迟至少 4ms（HTML 标准规定），且会被其他宏任务插队；而微任务更及时、高效。

4. **如何手动添加微任务？**  
   → 使用 `queueMicrotask(callback)`（现代标准方法，比 `Promise.resolve().then()` 更语义化）。

---

## 📚 附：推荐记忆口诀

> **“宏一次，微清空；微里加微，照样行；宏宏之间，微优先。”**

---

如果你希望我用图解、动画逻辑，或者结合 V8 引擎源码层面解释 Event Loop 的实现，也可以继续提问！