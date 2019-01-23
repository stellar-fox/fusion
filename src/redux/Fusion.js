import {
    createReducer,
    string
} from "@xcmats/js-toolbox"




// <Application> state
const initState = {
    backupError: string.empty(),
    backupInProgress: false,
    loading: false,
    restoreError: string.empty(),
    restoreInProgress: false,
    restoredBackup: null,
    // window dimensions
    dim: {
        width: window.innerWidth,
        height: window.innerHeight,
    },
}




// ...
export const SET_DIMENSIONS = "@Fusion/SET_DIMENSIONS"
export const SET_STATE = "@Fusion/SET_STATE"
export const RESET_STATE = "@Fusion/RESET_STATE"




// ...
export const action = {

    // ...
    setDimensions: () => ({
        type: SET_DIMENSIONS,
        dim: {
            width: window.innerWidth,
            height: window.innerHeight,
        },
    }),

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
    [SET_DIMENSIONS]: (state, action) => ({
        ...state,
        dim: { ...action.dim },
    }),
    

    // ...
    [SET_STATE]: (state, action) => ({
        ...state,
        ...action.state,
    }),


    // ...
    [RESET_STATE]: () => initState,

})
