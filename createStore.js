/**
 * Created by Lever on 16/11/9.
 */
const _ = require("../util/util");

module.exports = (reducer, preloadedState) => {
    let currentState = preloadedState,
        currentListener;
    const currentReducer = reducer,
        listeners = [];

    const getState = () => currentState;

    const subscribe = listener => {
        const index = listeners.length;
        listeners.push(listener);
        currentListener = listener;
        return () => listeners.splice(index, 1);
    };

    // Fixme: 在Redux中，异步的处理放到了actionCreater中而非reducer中
    const dispatch = action => {
        currentState = currentReducer(currentState, action);
        currentState.then ?
            currentState.then(data => {
                !!data.then || (currentState = {
                    ...currentState,
                    ...data
                });
                listeners.slice().forEach(item => item(action));
            }) : listeners.slice().forEach(item => item(action));

        return action;
    };

    return {
        dispatch,
        subscribe,
        getState
    };
};