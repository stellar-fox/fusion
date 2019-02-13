import { createReducer } from "@xcmats/js-toolbox"




export const semaphoreNames = {
    PENDING_REAUTH: "pendingReAuth",
}




export const SEMAPHORE_TOGGLE = "@SEMAPHORE/TOGGLE"




// <Semaphore> redux tree state
const initState = {
    [semaphoreNames.PENDING_REAUTH]: false,
}




// ...
export const actions = {

    // toggle semaphore
    toggleSemaphore: (semaphoreKey, pending) => ({
        type: SEMAPHORE_TOGGLE,
        semaphoreKey,
        pending,
    }),

}




// ...
export const reducer = createReducer(initState)({

    // ...
    [SEMAPHORE_TOGGLE]: (state, action) => ({
        ...state,
        [action.semaphoreKey]: action.pending,
    }),

})
