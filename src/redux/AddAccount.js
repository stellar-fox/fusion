import { createReducer, string } from "@xcmats/js-toolbox"




/**
 * Initial state for _AddAccount_ Redux key.
 */
const initState = {
    accountType: string.empty(),
    dialogShowing: false,
    name: string.empty(),
    signingMethod: string.empty(),
}




/**
 * Action Types
 */
export const RESET_STATE = "@AddAccount/RESET_STATE"
export const SET_ACCOUNT_TYPE = "@AddAccount/SET_ACCOUNT_TYPE"
export const SET_NAME = "@AddAccount/SET_NAME"
export const SET_SIGNING_METHOD = "@AddAccount/SET_SIGNING_METHOD"
export const SET_STATE = "@AddAccount/SET_STATE"
export const TOGGLE_DIALOG = "@AddAccount/TOGGLE_DIALOG"




/**
 * Actions
 */
export const actions = {

    // ...
    resetState: () => ({ type: RESET_STATE }),


    // Sets account type (DEMO or REAL).
    setAccountType: (accountType) => ({
        type: SET_ACCOUNT_TYPE,
        accountType,
    }),


    // Sets the name alias on the account.
    setName: (name) => ({
        type: SET_NAME,
        name,
    }),


    // Sets the signing method name string.
    setSigningMethod: (signingMethod) => ({
        type: SET_SIGNING_METHOD,
        signingMethod,
    }),


    // ...
    setState: (state) => ({
        type: SET_STATE,
        state,
    }),


    // ...
    toggleDialog: (showing) => ({
        type: TOGGLE_DIALOG,
        showing,
    }),

}




/**
 * Reducers
 */
export const reducers = createReducer(initState)({
    
    // ...
    [RESET_STATE]: () => initState,


    // ...
    [SET_ACCOUNT_TYPE]: (state, action) => ({
        ...state,
        accountType: action.accountType,
    }),


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


    // ...
    [TOGGLE_DIALOG]: (state, action) => ({
        ...state,
        dialogShowing: action.showing,
    }),

})
