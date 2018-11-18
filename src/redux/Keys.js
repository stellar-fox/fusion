import { createReducer } from "@xcmats/js-toolbox"
import { testNetworkPassphrase } from "../lib/constants"
import { string } from "@xcmats/js-toolbox"

// <Keys> initial state
const initState = {
    ModalAwaitLedger: { showing: false },
    ModalAwaitPure: { showing: false },
    ModalSignupLedger: { showing: false },
    ModalSignupPure: { showing: false },
    ModalSignupSceptic: { showing: false },
    awaitingShambhalaResponse: false,
    signingMethod: null,
    accountId: null,
    account: 0,
    signingKeys: {},
    balance: "0.0000000",
    networkPassphrase: testNetworkPassphrase,
    progressMessage: string.empty(),
    deviceSoftwareVersion: null,
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
    showSignupLedgerModal: () => (dispatch) => dispatch(action.setState({
        ModalSignupLedger: { showing: true },
    })),

    // ...
    hideSignupLedgerModal: () => (dispatch) => dispatch(action.setState({
        ModalSignupLedger: { showing: false },
    })),

    // ...
    showAwaitLedgerModal: () => (dispatch) => dispatch(action.setState({
        ModalAwaitLedger: { showing: true },
    })),

    // ...
    hideAwaitLedgerModal: () => (dispatch) => dispatch(action.setState({
        ModalAwaitLedger: { showing: false },
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
    setAccount: (account) => (dispatch) => dispatch(action.setState({
        account,
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