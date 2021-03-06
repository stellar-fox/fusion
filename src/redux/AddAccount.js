import { createReducer, string, toBool } from "@xcmats/js-toolbox"
import { signingMethod } from "./Keys"



/**
 * Initial state for _AddAccount_ Redux key.
 */
const initState = {
    accountId: string.empty(),
    accountType: string.empty(),
    activeStep: 0,
    error: false,
    errorMessage: string.empty(),
    dialogShowing: false,
    name: string.empty(),
    networkPassphrase: string.empty(),
    signingMethod: signingMethod.SHAMBHALA,
}




/**
 * Action Types
 */
export const RESET_STATE = "@AddAccount/RESET_STATE"
export const SET_ACCOUNT_ID = "@AddAccount/SET_ACCOUNT_ID"
export const SET_ACCOUNT_TYPE = "@AddAccount/SET_ACCOUNT_TYPE"
export const SET_ACTIVE_STEP = "@AddAccount/SET_ACTIVE_STEP"
export const SET_NAME = "@AddAccount/SET_NAME"
export const SET_NETWORK_PASSPHRASE = "@AddAccount/SET_NETWORK_PASSPHRASE"
export const SET_SIGNING_METHOD = "@AddAccount/SET_SIGNING_METHOD"
export const SET_STATE = "@AddAccount/SET_STATE"
export const TOGGLE_DIALOG = "@AddAccount/TOGGLE_DIALOG"
export const TOGGLE_ERROR = "@AddAccount/TOGGLE_ERROR"




/**
 * Actions
 */
export const actions = {

    // ...
    resetState: () => ({ type: RESET_STATE }),


    // Sets the generated stellar account id.
    setAccountId: (accountId) => ({
        type: SET_ACCOUNT_ID,
        accountId,
    }),  


    // Sets account type (DEMO or REAL).
    setAccountType: (accountType) => ({
        type: SET_ACCOUNT_TYPE,
        accountType,
    }),


    // Sets the current step of the account creation process
    setActiveStep: (step) => ({
        type: SET_ACTIVE_STEP,
        step,
    }),


    // Sets the name alias on the account.
    setName: (name) => ({
        type: SET_NAME,
        name,
    }),


    // Sets the network passphrase based on account type selection
    setNetworkPassphrase: (networkPassphrase) => ({
        type: SET_NETWORK_PASSPHRASE,
        networkPassphrase,
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


    // Turns error indicator on/off in a user input component.
    toggleError: (errorMessage) => ({
        type: TOGGLE_ERROR,
        errorMessage,
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
    [SET_ACCOUNT_ID]: (state, action) => ({
        ...state,
        accountId: action.accountId,
    }),


    // ...
    [SET_ACCOUNT_TYPE]: (state, action) => ({
        ...state,
        accountType: action.accountType,
    }),


    // ...
    [SET_ACTIVE_STEP]: (state, action) => ({
        ...state,
        activeStep: action.step,
    }),


    // ...
    [SET_NAME]: (state, action) => ({
        ...state,
        name: action.name,
    }),


    // ...
    [SET_NETWORK_PASSPHRASE]: (state, action) => ({
        ...state,
        networkPassphrase: action.networkPassphrase,
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


    // ...
    [TOGGLE_ERROR]: (state, action) => {
        return ({
            ...state,
            error: toBool(action.errorMessage),
            errorMessage: action.errorMessage,
        })
    },
    

})
