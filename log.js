/**
 * Created by Lever on 17/3/10.
 */

module.exports = store => {
    const rawDispatch = store.dispatch;
    
    return process.env.NODE_ENV === "production" ? rawDispatch : action => {
        console.group(action.type);
        console.log("%c prev state", "color: gray", store.getState());
        console.log("%c action", "color: blue", action);
        const returnValue = rawDispatch(action);
        console.log("%c next state", "color: green", store.getState());
        console.groupEnd(action.type);
        return returnValue;
    };
};
