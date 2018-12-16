import {
    createReducer,
    string,
} from "@xcmats/js-toolbox"




// <Awaiter> initial state
const initState = {
    progressMessage: string.empty(),
    spinnerVisible: false,
    errorMessage: string.empty(),
    error: false,
    success: false,
    loading: false,
}




// state const definitions
export const RESET_STATE = "@Awaiter/RESET_STATE"
export const SET_LOADING = "@Awaiter/SET_LOADING"
export const SET_LOADED = "@Awaiter/SET_LOADED"
export const SET_PROGRESS_MESSAGE = "@Awaiter/SET_PROGRESS_MESSAGE"
export const SET_STATE = "@Awaiter/SET_STATE"
export const SHOW_SPINNER = "@Awaiter/SHOW_SPINNER"
export const HIDE_SPINNER = "@Awaiter/HIDE_SPINNER"
export const SET_SUCCEDED = "@Awaiter/SET_SUCCEDED"
export const SET_FAILED = "@Awaiter/SET_FAILED"
export const SET_ERROR_MESSAGE = "@Awaiter/SET_ERROR_MESSAGE"




// ...
export const action = {

    // ...
    resetState: () => ({ type: RESET_STATE }),

    // ...
    setErrorMessage: (errorMessage) => ({
        type: SET_ERROR_MESSAGE,
        errorMessage,
    }),

    // ...
    setProgressMessage: (progressMessage) => ({
        type: SET_PROGRESS_MESSAGE,
        progressMessage,
    }),

    // ...
    setSucceded: () => ({ type: SET_SUCCEDED }),

    // ...
    setFailed: () => ({ type: SET_FAILED }),

    // ...
    setLoading: () => ({ type: SET_LOADING }),

    // ...
    setLoaded: () => ({ type: SET_LOADED }),

    // ...
    showSpinner: () => ({ type: SHOW_SPINNER }),

    // ...
    hideSpinner: () => ({ type: HIDE_SPINNER }),

    // ...
    setState: (state) => ({
        type: SET_STATE,
        state,
    }),

}




// ...
export const reducer = createReducer(initState)({

    // ...
    [SET_ERROR_MESSAGE]: (state, action) => ({
        ...state,
        errorMessage: action.errorMessage,
    }),


    // ...
    [SET_SUCCEDED]: (state, _action) => ({
        ...state,
        success: true,
        error: false,
    }),

    // ...
    [SET_FAILED]: (state, _action) => ({
        ...state,
        success: false,
        error: true,
    }),

    // ...
    [SHOW_SPINNER]: (state, _action) => ({
        ...state,
        spinnerVisible: true,
    }),

    // ...
    [HIDE_SPINNER]: (state, _action) => ({
        ...state,
        spinnerVisible: false,
    }),

    // ...
    [SET_LOADING]: (state, _action) => ({
        ...state,
        loading: true,
    }),

    // ...
    [SET_LOADED]: (state, _action) => ({
        ...state,
        loading: false,
    }),

    // ...
    [RESET_STATE]: () => initState,

    // ...
    [SET_PROGRESS_MESSAGE]: (state, action) => ({
        ...state,
        progressMessage: action.progressMessage,
    }),

    // ...
    [SET_STATE]: (state, action) => ({
        ...state,
        ...action.state,
    }),

})
