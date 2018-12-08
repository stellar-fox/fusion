import { createReducer } from "@xcmats/js-toolbox"




// <Pay> initial state
const initState = {
    ModalPay: { showing: false },
}




// state const definitions
export const RESET_STATE = "@Pay/RESET_STATE"
export const SET_STATE = "@Pay/SET_STATE"




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
