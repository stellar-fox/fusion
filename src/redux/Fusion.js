import { createReducer } from "@xcmats/js-toolbox"




// <Application> state
const initState = {}




// ...
export const SET_STATE = "@Fusion/SET_STATE"
export const RESET_STATE = "@Fusion/RESET_STATE"




// ...
export const action = {

    // ...
    setState: (state) => ({
        type: SET_STATE,
        state,
    }),


    // ...
    resetState: () => ({ type: RESET_STATE }),

}




// ...
export const reducer = createReducer(initState)({

    // ...
    [SET_STATE]: (state, action) => ({
        ...state,
        ...action.state,
    }),


    // ...
    [RESET_STATE]: () => initState,

})
