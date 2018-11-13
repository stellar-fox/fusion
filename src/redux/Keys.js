import { createReducer } from "@xcmats/js-toolbox"




// <Keys> initial state
const initState = {
    ModalSignupPure: { showing: false },
    ModalSignupLedger: { showing: false },
    ModalSignupSceptic: { showing: false },
}




// state const definitions
export const RESET_STATE = "@Keys/RESET_STATE"
export const SET_STATE = "@Keys/SET_STATE"




// ...
export const action = {

    // ...
    showSignupPureModal: () => (dispatch) => dispatch(action.setState({
        ModalSignupPure: { showing: true },
    })),

    // ...
    hideSignupPureModal: () => (dispatch) => dispatch(action.setState({
        ModalSignupPure: { showing: false },
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
