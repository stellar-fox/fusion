import { createReducer } from "@xcmats/js-toolbox"




// <Pay> initial state
const initState = {
    ModalPay: { showing: false },
    availableSigningMethods: [],
}




// state const definitions
export const RESET_STATE = "@Pay/RESET_STATE"
export const SET_SIGNING_METHODS = "@Pay/SET_SIGNING_METHODS"
export const SET_STATE = "@Pay/SET_STATE"




// ...
export const action = {

    // ...
    setAvailableSigningMethods: (signingMethods) => ({
        type: SET_SIGNING_METHODS,
        signingMethods,
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
    [SET_SIGNING_METHODS]: (state, action) => ({
        ...state,
        availableSigningMethods: action.signingMethods,
    }),

    // ...
    [RESET_STATE]: () => initState,


    // ...
    [SET_STATE]: (state, action) => ({
        ...state,
        ...action.state,
    }),

})
