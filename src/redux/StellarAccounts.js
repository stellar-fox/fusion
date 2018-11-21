import { createReducer } from "@xcmats/js-toolbox"




// <StellarAccount> initial state
const initState = {}


// state const definitions
export const UPDATE_ACCOUNT_STATE = "@StellarAccount/UPDATE_ACCOUNT_STATE"
export const ADD_SIGNING_METHOD = "@StellarAccount/ADD_SIGNING_METHOD"
export const RESET_STATE = "@StellarAccount/RESET_STATE"
export const SET_STATE = "@StellarAccount/SET_STATE"


// ...
export const action = {

    // ...
    updateAccountState: (account) => ({
        type: UPDATE_ACCOUNT_STATE,
        account,
    }),

    // ...
    addSigningMethod: (accountId, signingMethod) => ({
        type: ADD_SIGNING_METHOD,
        accountId,
        signingMethod,
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

    // ...
    [UPDATE_ACCOUNT_STATE]: (state, action) => ({
        ...state,
        [action.account.id]: {
            accountId: action.account.id,
            sequence: action.account.sequence,
            networkPassphrase: action.account.networkPassphrase,
            horizonUrl: action.account.horizonUrl,
            balances: action.account.balances,
            signingMethods: [],
        },
    }),


    // ...
    [ADD_SIGNING_METHOD]: (state, action) => ({
        ...state,
        [action.accountId]: {
            ...state[action.accountId],
            signingMethods:
                state[action.accountId]
                    .signingMethods
                    .concat([action.signingMethod]),
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
