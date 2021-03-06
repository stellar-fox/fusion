import { createReducer } from "@xcmats/js-toolbox"




// <Balances> initial state
const initState = {
    tabSelected: 0,
}




// state const definitions
export const RESET_STATE = "@Balances/RESET_STATE"
export const SET_STATE = "@Balances/SET_STATE"




// ...
export const action = {

    // ...
    changeTab: (tabIndex) => (dispatch) => dispatch(action.setState({
        tabSelected: tabIndex,
    })),

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
