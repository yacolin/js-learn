# Webpack

## 概念

本质上，**webpack**是一个用于现代 JavaScript 应用程序（支持 ESM 和 CommonJS）的*静态模块打包工具*。并且可以扩展为支持许多不同的静态资源，例如：images，fonts 和 stylesheets。当 webpack 处理应用程序时，它会在内部构建一个依赖图，此时依赖图对应映射到项目所需的每个模块，并生成一个或多个*bundle*。

## 为什么选择 webpack

在浏览器中运行 JavaScript 有两种方法。第一种方式，引用一些脚本来存放每个功能；此解决方案很难扩展，因为加载太多会导致网络瓶颈。第二种方式，使用一个包含所有项目代码的大型`.js`文件，但是这会导致作用域、文件大小、可读性和可维护性方面的问题。

### 立即调用函数表达式（IIFE）- Immediately invoked function expressions

IIFE 解决大型项目的作用域问题；当脚本文件封装在 IIFE 内部是，你可以安全地拼接或安全地组合所有文件，而不必担心作用域冲突。

IIFE 使用方式产生出 Make，Gulp，Grunt，Broccoli 或 Brunch 等工具，这些工具成为任务执行器，他们将所有项目文件拼接在一起。

但是，修改一个文件意味着必须重新构建整个文件。拼接可以做到很容易地跨文本重用脚本，但是却使构建结果的优化变得更加困难。如何判断使用代码是否世界被使用？

即使你只使用了 lodash 中的某个函数，也必须在构建结果中加入整个库，然后将他们压缩在一起。

## loader

loader 用于对于模块的源代码进行转换，loader 可以使你在 import 或者“loader（加载）”模块时预处理文件。因此 loader 类似于其他构建工具中“任务（task）”，并提供了处理前端构建步骤的得力方式。loader 可以将文件从不同的语言（如 TypeScript）转换为 JavaScript 或将内联图像转换为 data URL。loader 甚至允许你直接在 JavaScript 模块内 import CSS 文件！

### loader 特性

- loader 支持链式调用。链中的每个 loader 会将转换应用在已处理过的资源上。一组链式的 loader 将按照相反的顺序执行。链中的第一个 loader 其记过（也就是应用过后的资源）传递给下一个 loader，以此类推。最后，链中的最后一个 loader，返回 webpack 所期望的 JavaScript。
- loader 可以是同步的也可以是异步的。
- loader 运行在 Node.js 中，并且能够执行任何操作。
- loader 可以通过`options`对象配置（仍然支持使用`query`参数来设置选项，但是这种方式已被废弃）
- 除了常见的通过 package.json 的`main`来将一个 npm 模块导出为 loader，还可以在 module.rules 中使用`loader`字段直接引用一个模块
- 插件（plugin）可以为 loader 带来更多特性。
- loader 能够产生额外的任意文件。
  可以通过 loader 的预处理函数，为 JavaScript 生态系统提供更多能力。用户现在可以更加灵活地引用细粒度逻辑，例如：压缩、打包、语言转译（或编译）和更多其他特性。

## plugin

**插件**是 webpack 的支柱功能。webpack 自身也是构建于你在 webpack 配置中用到的**相同的插件体系**之上！
插件的目的在于解决 loader 无法实现的**其他事**

### 剖析

wepback 插进是一个具有 apply 方法的 JavaScript 对象。apply 方法会被 webpack compiler 调用，并且在整个编译生命周期都可以访问 compiler 对象。

### 用法

由于插件可以携带参数/选项，你必须在 webpack 配置中，向 plugins 属性传入一个 new 实例。
