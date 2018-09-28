import { createReducer } from "@xcmats/js-toolbox"




// <UserManagement> initial state
const initState = {}




// state const definitions
export const RESET_STATE = "@UserManagement/RESET_STATE"
export const SET_STATE = "@UserManagement/SET_STATE"




// ...
export const action = {

    // ...
    resetState: () => ({ type: RESET_STATE, }),


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
