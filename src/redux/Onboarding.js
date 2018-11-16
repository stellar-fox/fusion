/**
 * Fusion.
 *
 * Onboarding reducer (temporary idea).
 *
 * @module onboarding-actions
 * @license Apache-2.0
 */




import { createReducer } from "@xcmats/js-toolbox"




// Onboarding state
const initState = {
    signingMethod: null,
    accountId: null,
}




// ...
export const RESET_STATE = "@Onboarding/RESET_STATE"
export const SET_STATE = "@Onboarding/SET_STATE"




// ...
export const action = {

    // ...
    resetState: () => ({ type: RESET_STATE }),


    // ...
    setState: (state) => ({
        type: SET_STATE,
        state,
    }),

}




// ...
export const reducer = createReducer(initState)({

    // ...
    [RESET_STATE]: () => initState,


    // ...
    [SET_STATE]: (state, action) => ({
        ...state,
        ...action.state,
    }),

})
