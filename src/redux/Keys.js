import { createReducer } from "@xcmats/js-toolbox"



// <Keys> initial state
const initState = {
    ModalAwaitPure: { showing: false },
    ModalSignupPure: { showing: false },
    ModalSignupLedger: { showing: false },
    ModalSignupSceptic: { showing: false },
    awaitingShambhalaResponse: false,
    signingMethod: null,

}




// state const definitions
export const RESET_STATE = "@Keys/RESET_STATE"
export const SET_STATE = "@Keys/SET_STATE"


/**
 * Enumeration of possible signing methods.
 *
 * @constant signingMethod
 */
export const signingMethod = Object.freeze({
    MANUAL: "manual",
    LEDGERHQ: "ledgerhq",
    SHAMBHALA: "shambhala",
})


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
    showAwaitPureModal: () => (dispatch) => dispatch(action.setState({
        ModalAwaitPure: { showing: true },
    })),

    // ...
    hideAwaitPureModal: () => (dispatch) => dispatch(action.setState({
        ModalAwaitPure: { showing: false },
    })),

    // ...
    setAwaitingResponse: () => (dispatch) => dispatch(action.setState({
        awaitingShambhalaResponse: true,
    })),

    // ...
    cancelAwaitingResponse: () => (dispatch) => dispatch(action.setState({
        awaitingShambhalaResponse: false,
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
