/**
 * Created by Lever on 17/3/13.
 */

module.exports = store => {
    const rawDispatch = store.dispatch;

    return action => typeof action.then === "function" ? action.then(rowDispatch) : rawDispatch(action);
};
