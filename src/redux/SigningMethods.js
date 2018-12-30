import { createReducer } from "@xcmats/js-toolbox"




// <SigningMethods> initial state
const initState = {}


// state const definitions
export const ADD_SIGNING_METHOD = "@SigningMethods/ADD_SIGNING_METHOD"
export const RESET_STATE = "@SigningMethods/RESET_STATE"
export const SET_STATE = "@SigningMethods/SET_STATE"


// ...
export const action = {

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


    // ...
    [RESET_STATE]: () => initState,


    // ...
    [SET_STATE]: (state, action) => ({
        ...state,
        ...action.state,
    }),

})
