# Webpack

## 概念

本质上，**webpack**是一个用于现代 JavaScript 应用程序（支持 ESM 和 CommonJS）的*静态模块打包工具*。并且可以扩展为支持许多不同的静态资源，例如：images，fonts 和 stylesheets。当 webpack 处理应用程序时，它会在内部构建一个依赖图，此时依赖图对应映射到项目所需的每个模块，并生成一个或多个*bundle*。

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

webpack 插进是一个具有 apply 方法的 JavaScript 对象。apply 方法会被 webpack compiler 调用，并且在整个编译生命周期都可以访问 compiler 对象。

### 用法

由于插件可以携带参数/选项，你必须在 webpack 配置中，向 plugins 属性传入一个 new 实例。

## 构建性能

### 通用环境

- 更新到最新版本
- loader 将loader应用于最少数量的模块
- 引导（bootstrap）每个额外的loader/plugin都有其启动时间。尽量少的使用工具。
- 解析，以下步骤可以提高解析速度：
  - 减少 resolve.modules, resolve.extensions, resolve.mainFiles, resolve.descriptionFiles 中条目数量，因为他们会增加文件系统调用的次数。
  - 如果你不使用symlinks（例如 npm link 或者 yarn link），可以设置 resolve.symlinks: false
  - 如果你使用自定义resolve plugin 规则，并且没有指定context上下文，可以设置resolve.cacheWithContext: false
- dll 使用DllPlugin 为更改不频繁的代码生成单独的编译记过。这可以提高应用程序的编译速度，尽管它增加了构建过程的复杂度。
- 小即是快（smaller = faster）较少编译结果的整体大小，以提高构建性能。尽量保持chunk体积小。
  - 使用数量更少/体积更小library
  - 在多页面应用程序中使用SplitChunksPlugin，并开启async模式
  - 移除未引用diamante
  - 只编译你当前正在开发的那些代码
- worker池（worker pool）thread-loader 可以将非常消耗资源的loader分流给一个worker pool
- 持久化缓存 在webpack配置中使用cache选项。使用package.json中的”postinstall“清除缓存目录
- 自定义plugin/loader 对它们进行概要分析，以免在此处引入性能问题。
- Progress plugin 将ProgressPlugin从webpack中删除，可以缩短构建时间。

### 开发环境

- 增量编译 使用webpack的watch mode（监听模式）。而不是用其他工具来watch文件和调用webpack。内置的watch mode会记录时间戳并将此信息传递给compilation以使缓存失效。
  在某些配置环境中，watch mode会回退到 poll mode（轮询模式）。监听许多文件会导致CPU大量负载。在这些情况下，可以使用watchOptions.poll来增加轮询的间隔时间。
- 在内存中编译：下面几个工具通过在内存中（而不是写入磁盘）编译和serve资源来提高性能：
  - webpack-dev-server
  - webpack-hot-middleware
  - webpack-dev-middleware
- stats.toJson加速
- Devtool
- 避免在生产环境下才会用到的工具
- 最小化entry chunk
- 避免额外的优化步骤
- 输出结果不携带路径信息
- Node.js版本8.9.10 - 9.11.1
- TypeScript loader

## 生产环境

- Source Maps

## 工具相关问题

- Babel：最小化项目中的preset/plugin数量。
- TypeScript
  - 在单独的进程中使用fork-ts-checker-webpack-plugin进行类型检查。
  - 配置loader跳过类型检查
  - 使用ts-loader时，设置happyPackMode: true/ transpileOnly: true
- Sass
  - node-sass中有个来自Node.js线程池的阻塞线程的bug。当使用thread-loader时，需要设置workerParallelJobs: 2

## 模块热替换（Hot Module Replacement）

模块热替换功能会在应用程序运行过程中，替换、添加或删除模块，而无需重新加载整个页面。主要是通过以下几种方式，来显著加快开发速度：

- 保留在完全重新加载页面期间丢失的应用程序状态。
- 只更新变更内容，以节省宝贵的开发时间。
- 在源代码中CSS/JS产生修改时，会立刻在浏览器中进行更新，这几乎相当于在浏览器devtool直接更改样式。

### 这一切是如何运行的？

#### 在应用程序中

通过以下步骤，可以做到在应用程序中置换（swap in and out）模块：

1. 应用程序要求 HMR runtime 检查更新。
2. HMR runtime 异步下载更新，然后通知应用程序。
3. 应用程序要求 HMR runtime应用更新。
4. HMR runtime 同步地应用更新。

#### 在compiler中

除了普通资源，compiler需要发出”update“，将之前的版本更新到新的版本。”update“由两部分组成：

1. 更新后的manifest（JSON）
2. 一个或多个updated chunk（JavaScript）

manifest包括新的compilation hash 和所有的updated chunk列表。每个chunk都包含着全部更新模块的最新代码（或一个flag用于表明此模块需要被移除）。
compiler会确保在这些模块之间的模块ID和chunk ID保持一致。通常将这些ID存储在内存中（例如，使用webpack-dev-server），但是也可能会将他们存储在一个JSON文件中。

#### 在模块中

HMR是可选功能，只会影响包含HMR代码的模块。
举个例子，通过style-loader为style追加补丁。为了运行追加补丁，style-loader实现了HMR接口；当它通过HMR接收到更新，它会使用新的样式替换就得样式。
类似的，当在一个模块中实现了HMR接口，你可以描述出当前模块被更新后发生了什么。然而在多数的情况下，不需要在每个模块中强行写入HMR代码。如果一个模块没有HMR处理函数，更新就会
冒泡（bubble up）。这意味着某个单独处理函数能够跟心整个模块树。如果在模块术的一个单独模块被更新，那么整组依赖模块都会被重新加载。

## 为什么选择 webpack

在浏览器中运行 JavaScript 有两种方法。

1. 第一种方式，引用一些脚本来存放每个功能；此解决方案很难扩展，因为加载太多会导致网络瓶颈。
2. 第二种方式，使用一个包含所有项目代码的大型`.js`文件，但是这会导致作用域、文件大小、可读性和可维护性方面的问题。

## 揭示内部原理

打包，是指处理某些文件并将其输出为其他文件的能力。但是，在输入和输出之间，还包括有模块，入口起点，chunk，chunk组和许多其他中间部分。

### 主要部分

项目中使用的每一个文件都是一个模块，通过互相引用，这些模块会形成一个图（ModuleGraph）数据结构。
在打包过程中，模块会被合并成chunk。chunk合并成chunk组，并形成一个通过模块互相连接的图。那么如何通过以上来描述一个入口起点：在其内部，会创建一个只有一个chunk的chunk组。

### chunk

chunk有两种形式：

- initial（初始化）是入口起点的main chunk。此chunk包含入口起点制定的所有模块及其依赖项。
- non-initial 是可以延迟加载的块。可能会出现在使用动态导入（dynamic imports）或者 SplitChunksPlugin时。

每个chunk都有对应的asset（资源）。资源，是指输出文件（即打包结果）。

### output

输出文件的名称会受配置中的两个字段影响：

- output.filename - 用于initial chunk文件
- output.chunkFilename - 用于non-initial chunk文件
- 在某些情况下，使用initial和non-initial的chunk时，可以使用output.filename.

这些字段中会有一些占位符。常用占位符如下：

- [id] - chunk id（列如 [id].js -> 458.js）
- [name] - chunk name （例如 [name].js -> app.js）。如果chunk没有名称，则会使用其id作为名称
- [contenthash] - 输出文件内容的md4-hash（例如 [contenthash].js -> 4ea6ff1de66c537eb9b2.js） 
