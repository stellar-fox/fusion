import { createReducer } from "@xcmats/js-toolbox"




// <StellarAccount> initial state
const initState = {}


// state const definitions
export const ADD_SIGNING_METHOD_WITH_ACCOUNT = "@StellarAccount/ADD_SIGNING_METHOD_WITH_ACCOUNT"
export const UPDATE_ACCOUNT_STATE = "@StellarAccount/UPDATE_ACCOUNT_STATE"
export const ADD_SIGNING_METHOD = "@StellarAccount/ADD_SIGNING_METHOD"
export const RESET_STATE = "@StellarAccount/RESET_STATE"
export const SET_STATE = "@StellarAccount/SET_STATE"


// ...
export const action = {

    // ...
    updateAccountState: (stellarAccount) => ({
        type: UPDATE_ACCOUNT_STATE,
        stellarAccount,
    }),

    // ...
    addSigningMethod: (accountId, signingMethod) => ({
        type: ADD_SIGNING_METHOD,
        accountId,
        signingMethod,
    }),

    // ...
    addSigningMethodWithAccount: (accountId, signingMethod, account) => ({
        type: ADD_SIGNING_METHOD_WITH_ACCOUNT,
        accountId,
        signingMethod,
        account,
    }),

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

    // Update stellar account
    [UPDATE_ACCOUNT_STATE]: (state, action) => ({
        ...state,
        [action.stellarAccount.id]: {
            accountId: action.stellarAccount.id,
            sequence: action.stellarAccount.sequence,
            networkPassphrase: action.stellarAccount.networkPassphrase,
            horizonUrl: action.stellarAccount.horizonUrl,
            balances: action.stellarAccount.balances,
            signingMethods: action.stellarAccount.signingMethods || [],
        },
    }),


    // ...
    [ADD_SIGNING_METHOD]: (state, action) => ({
        // ...state,
        // [action.accountId]: {
        //     ...state[action.accountId],
        //     signingMethods:
        //         state[action.accountId]
        //             .signingMethods
        //             .concat([action.signingMethod]),
        // },
        ...state,
        [action.accountId]: {
            ...state[action.accountId],
            signingMethods: {
                ...state[action.accountId].signingMethods,
                [action.signingMethod]: {
                    createdAt: Date.now(),
                },
            },
        },
    }),


    // Adds LedgerHQ account (if such onboarding method was chosen)
    [ADD_SIGNING_METHOD_WITH_ACCOUNT]: (state, action) => ({
        ...state,
        [action.accountId]: {
            ...state[action.accountId],
            signingMethods: {
                ...state[action.accountId].signingMethods,
                [action.signingMethod]: {
                    account: action.account,
                    createdAt: Date.now(),
                },
            },
        },
    }),


    // ...
    [RESET_STATE]: () => initState,


    // ...
    [SET_STATE]: (state, action) => ({
        ...state,
        ...action.state,
    }),

})
