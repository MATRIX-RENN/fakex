# fakex
simple redux for IE8

fakex 是一个类 Redux 库，用于解决状态管理的问题。


# 文件结构
```Tree
.
├── createStore.js // store核心组件 
├── fakex.js //入口
├── log.js //开发中的log
└── promise.js // 异步组件
```

# 基本使用方法
一个 Redux 应用 包括 reducer action Store

他的基本目录结构应该是这样的
```Tree
.
├── app.js 组件入口 
├── Action.js //action分发 （可选）
├── Reducer.js // reducer分发，根据触发的Action选择对应的子组件reduce生产新的state
├── childComponent
│   ├── action.js 组件所需要的交互操作
│   ├── reducer.js 根据Action生产新的state
│   └── view.js 视图层，一般是stateless component
```
## app.js
在 root 组件中，我们进行 state 的创建。

为了统一管理 reducer 我们的根 reducer 会根据 action 进行分发，匹配对应子 reducer

这些 reducer 是在 childComponent 中建立的,用于对状态进行具体的处理

createStore 接收 reducer, preloadedState 等作为参数，来生产新的 Store 对象。
preloadedState 即为你的 initialze state。

之后需要你把 Store 生产的 state 通过 props 通知给子组件，以及 action 的触发函数 dispatch.
它大致是这个样子
```javascript
// constructor
this.state = {
  ...Store.getState()
};
// componentDidMount state改变后view自动渲染
Store.subscribe(() => {
  this.setState({ ...Store.getState() });
});
// render
<AppView {...this.state} dispatch={(action) => Store.dispatch(action)} />;
```

### reducer
reducer 的作用是根据 action 来产生新的 state

我们的 reducer.js 文件他的结构应该是这样的

```javascript
// 它拿到旧的state与action就能生成新的state
const Reducer = (state = {}, action) => {
  switch (action.type){
  // 这里的Action对象是为了管理action的分发库，你也可以直接用String
    case Action.getData:
    // 这里的generateData方法即为对应的子组件reduce,
    // 为了降低组件耦合率，当然不复杂的时候你也可以用全局reducer
      return generateData(state,action);
    default:
      return state;
  }   
}
```
### Store 
我们的 Store 由 createStore 给予的参数生成，他是一个对象。
经过实例化后 Store 拥有 
`getState`: 生成 Store 快照，拿到当前时刻的 State
`dispatch`: view层发出action，
`subscribe`： 监听 state 的变化，执行对应回调函数，和 redux 的用法是一样的。

## Action.js
Action 解决的问题是对 action type 进行管理，从而创建了一个全局的"字典"（当然这并不是一个标准的数据结构意义上的字典）。

它的作用就是查询对应的 action type，以方便 reducer 进行匹配。所以我们需要尽量使用符合规范的名称。
```javascript
// 它拿到旧的state与action就能生成新的state
module.exports = {
  GET_DATA:"GET_DATA"
}
```
## childComponent
子组件主要部分就是 action 与 reducer

### action
action 里面是 view 会触发的事件，view 触发 action 从而调用对应的 reducer 从而生产新的 state
```javascript
const getData = (data) => {
  return {
    // 这里的 GET_DATA 变量最好是从 root/Action.js 拿到的，这样方便与我们的管理
    // 当然你用String也可以...
    type  : GET_DATA,
    param : data,
  };
};
```
type 属性是必须的，你需要指明需要执行的 reducer，其他属性可以按需要添加。

### reducer
这里的函数用于生成新的 state
根reducer 在接收到 action 后会进行判断需要执行哪个子 reducer，这里就是真正执行的地方。
```javascript
const generateData = (state = {},action) => {
  switch (action.type){
    case GET_DATA:
      return {
        ...state
      };
    default:
      return state;
}
};
```
### view
view 层负责触发 action
我们直接通过 props.dispatch({type:"ACTION_TYPE"}) 来触发我们所需要的事件。
