import {
    createReducer,
    string
} from "@xcmats/js-toolbox"




// <UserLogin> state
const initState = {
    email: string.empty(),
    disabled: false,
    errorEmail: false,
    errorMessageEmail: string.empty(),
    errorMessagePassword: string.empty(),
    errorPassword: false,
    password: string.empty(),
    progressBarOpacity: 0,
}




// ...
export const SET_STATE = "@UserLogin/SET_STATE"
export const RESET_STATE = "@UserLogin/RESET_STATE"




// ...
export const action = {

    // ...
    setEmail: (email) =>
        async (dispatch, _getState) =>
            await dispatch(action.setState({ email })),


    // ...
    setPassword: (password) =>
        async (dispatch, _getState) =>
            await dispatch(action.setState({ password })),


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
