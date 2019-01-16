import { createReducer } from "@xcmats/js-toolbox"




// <StellarAccounts> initial state
const initState = {}


// state const definitions
export const ADD_SIGNING_METHOD_WITH_ACCOUNT = "@StellarAccounts/ADD_SIGNING_METHOD_WITH_ACCOUNT"
export const UPDATE_ACCOUNT_STATE = "@StellarAccounts/UPDATE_ACCOUNT_STATE"
export const ADD_SIGNING_METHOD = "@StellarAccounts/ADD_SIGNING_METHOD"
export const RESET_STATE = "@StellarAccounts/RESET_STATE"
export const SET_STATE = "@StellarAccounts/SET_STATE"
export const UPDATE_BALANCES = "@StellarAccounts/UPDATE_BALANCES"




// ...
export const action = {

    // ...
    updateAccountState: (stellarAccount) => ({
        type: UPDATE_ACCOUNT_STATE,
        stellarAccount,
    }),

    updateBalances: (accountId, nativeBalance, otherBalances) => ({
        type: UPDATE_BALANCES,
        accountId,
        nativeBalance,
        otherBalances,
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


    // Update balances
    [UPDATE_BALANCES]: (state, action) => ({
        ...state,
        [action.accountId]: {
            ...state[action.accountId],
            nativeBalance: action.nativeBalance,
            otherBalances: {...action.otherBalances},
            updatedAt: Date.now(),
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
