import { createReducer, string } from "@xcmats/js-toolbox"




/**
 * Initial state for _Signup_ Redux key.
 */
const initState = {
    name: string.empty(),
}




/**
 * Action Types
 */
export const RESET_STATE = "@Signup/RESET_STATE"
export const SET_NAME = "@Signup/SET_NAME"
export const SET_SIGNING_METHOD = "@Signup/SET_SIGNING_METHOD"
export const SET_STATE = "@Signup/SET_STATE"




/**
 * Actions
 */
export const actions = {

    // ...
    resetState: () => ({ type: RESET_STATE }),


    // ...
    setName: (name) => ({
        type: SET_NAME,
        name,
    }),


    // ...
    setSigningMethod: (signingMethod) => ({
        type: SET_SIGNING_METHOD,
        signingMethod,
    }),


    // ...
    setState: (state) => ({
        type: SET_STATE,
        state,
    }),

}




/**
 * Reducers
 */
export const reducers = createReducer(initState)({
    
    // ...
    [RESET_STATE]: () => initState,


    // ...
    [SET_NAME]: (state, action) => ({
        ...state,
        name: action.name,
    }),


    // ...
    [SET_SIGNING_METHOD]: (state, action) => ({
        ...state,
        signingMethod: action.signingMethod,
    }),


    // ...
    [SET_STATE]: (state, action) => ({
        ...state, // preserve previous state
        ...action.state, // set new key(s) and their values
    }),

})
