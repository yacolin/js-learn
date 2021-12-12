# 生命周期

## Before 16.3

- Mounting

  - constructor(props, context)
  - componentWillMount()
  - render()
  - componentDidMount()

- Update

  - componentWillReceiveProps(nextProps)
  - shouldComponentUpdate(nextProps, nextState)
  - componentWillUpdate(nextProps, nextState)
  - render()
  - componentDidUpdate(prevProps, prevState, snapshot)

- Unmounting
  - ComponentWillUnmount()

## After 16.3

- Mounting

  - constructor(props, context)
  - static getDerivedStateFromProps(props, state)
  - UNSAFE_componentWillMount()
  - render()
  - componentDidMount()

- Update

  - static getDerivedStateFromProps(props, state)
  - UNSAFE_componentWillReceiveProps(nextProps)
  - shouldComponentUpdate(nextProps, nextState)
  - UNSAFE_componentWillUpdate(nextProps, nextState)
  - render()
  - getSnapshotBeforeUpdate(prevProps, prevState)
  - componentDidUpdate(prevProps, prevState, snapshot)

- Unmounting
  - ComponentWillUnmount()

## 以前的生命周期为啥要置位 UNSAFE

- React 替换为 fiber 架构之后，导致有些生命周期的触发容易出现问题

# Hooks

- Basic Hooks
  - useState
  - useEffect
  - useContext
- Additional Hooks
  - useReducer
  - useCallback
  - useMemo
  - useRef
  - useImperativeHanld
  - useLayoutEffect
  - useDebugValue

# [SetState 为什么是异步的？那有在什么情况下是同步的？](https://juejin.cn/post/6844904093425598471#heading-39)

- 保持内部一致性：props 的更新是异步的，因为 re-render 父组件的时候，传入子组件的 props 才变化；为了保持数据一致，state 也不直接更新，都是在 flush 的时候更新
- 将 state 的更新延缓到最后的批量合并再去渲染更新对于应用的性能优化是有极大好处的，如果每次的状态改变都去重新渲染真实 DOM，那么它将带来巨大的性能消耗

# React 组件之间的通信方式

- 父组件向子组件通信 -- props 传递
- 子组件向父组件通信 -- 父组件传递回调函数给子组件，子组件调用该回调函数，便可以向父组件通信
- 跨级组件之间的通信 -- 层层传递 props 使用 context 对象
- 非嵌套组件间通信 -- 利用二者共同父组件的 context 对象进行通信 使用自定义事件的方式

# 虚拟 DOM DOM diff

- 虚拟 DOM 本质上是个对象，参照真实的 DOM 结构 在 JS 和真实 DOM 之间做了一层缓存，以便后续 DOM 的变动一次性的更新到真实 DOM 上
- Tree diff/Component diff/Element diff; key 的重要性
