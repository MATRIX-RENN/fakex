/**
 * Created by Lever on 17/2/28.
 */
const createStore = require("./createStore");

const bindActionCreator = (actionCreator, dispatch) => (...args) => dispatch(actionCreator(...args));

const bindActionCreators = (actionCreators, dispatch) => {
    if (typeof actionCreators === "function") {
        return bindActionCreator(actionCreators, dispatch);
    }
    const boundActionCreators = {};
    Object.keys(actionCreators).forEach(key => {
        const actionCreator = actionCreators[key];
        typeof actionCreator === "function" && (
            boundActionCreators[key] = bindActionCreator(actionCreator, dispatch)
        );
    });
    return boundActionCreators;
};
// 合并reduce
const combineReducer = reducers =>
    (state = {}, action) =>
        Object.keys(reducers).reduce(
            (nextState, key) => {
                nextState[key] = reducers[key](state[key], action);
                return nextState;
            },
            {}
        );
// 将所有中间件拷贝后组成一个数组，依次执行
// 这里的reverse视为了保证顺序的对应
const applyMiddleware = (store, middlewares) =>
    middlewares.slice().reverse().forEach(
        middleware => store.dispatch = middleware(store)(store.dispatch)
    );

module.exports = {
    createStore,
    bindActionCreators,
    combineReducer,
    applyMiddleware
};
