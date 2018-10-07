import { createReducer, string } from "@xcmats/js-toolbox"




// <UserManagement> initial state
const initState = {
    tabSelected: 0,
    snackbarOpen: false,
    snackbarMessage: string.empty(),
}




// state const definitions
export const RESET_STATE = "@UserManagement/RESET_STATE"
export const SET_STATE = "@UserManagement/SET_STATE"




// ...
export const action = {

    // ...
    changeTab: (tabIndex) => (dispatch) => dispatch(action.setState({
        tabSelected: tabIndex,
    })),

    // ...
    setCropStatus: (status) => (dispatch) => dispatch(action.setState({
        cropInProgress: status,
    })),

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
