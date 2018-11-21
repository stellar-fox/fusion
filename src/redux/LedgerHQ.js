import { createReducer, string } from "@xcmats/js-toolbox"




// <LedgerHQ> initial state
const initState = {
    softwareVersion: null,
    useDefaultAccount: true,
    account: "0",
    error: false,
    errorMessage: string.empty(),
}




// state const definitions
export const RESET_STATE = "@LedgerHQ/RESET_STATE"
export const SET_STATE = "@LedgerHQ/SET_STATE"




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
