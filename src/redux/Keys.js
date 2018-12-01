import { createReducer } from "@xcmats/js-toolbox"
import { testNetworkPassphrase } from "../lib/constants"
import { string } from "@xcmats/js-toolbox"

// <Keys> initial state
const initState = {
    accountId: null,
    errorMessage: string.empty(),
    ModalAwaitLedger: { showing: false },
    ModalAwaitPure: { showing: false },
    ModalAwaitSceptic: { showing: false },
    ModalSignupLedger: { showing: false },
    ModalSignupPure: { showing: false },
    ModalSignupSceptic: { showing: false },
    ModalTransactionDetails: { showing: false },
    networkPassphrase: testNetworkPassphrase,
    noButtonDisabled: false,
    progressMessage: string.empty(),
    signingKeys: {},
    signingMethod: null,
    spinnerVisible: false,
    txBody: string.empty(),
    txFee: string.empty(),
    txHash: string.empty(),
    txOpsNum: string.empty(),
    txSequenceNumber: string.empty(),
    txSignature: string.empty(),
    txSignedBody: string.empty(),
    txSourceAccount: string.empty(),
    yesButtonDisabled: true,
}




// state const definitions
export const RESET_STATE = "@Keys/RESET_STATE"
export const SET_STATE = "@Keys/SET_STATE"


/**
 * Enumeration of possible signing methods.
 * MANUAL, LEDGERHQ, SHAMBHALA
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
    showTransactionDetailsModal: () => (dispatch) => dispatch(action.setState({
        ModalTransactionDetails: { showing: true },
    })),

    // ...
    hideTransactionDetailsModal: () => (dispatch) => dispatch(action.setState({
        ModalTransactionDetails: { showing: false },
    })),

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
    showSignupScepticModal: () => (dispatch) => dispatch(action.setState({
        ModalSignupSceptic: { showing: true },
    })),

    // ...
    hideSignupScepticModal: () => (dispatch) => dispatch(action.setState({
        ModalSignupSceptic: { showing: false },
    })),

    // ...
    showAwaitScepticModal: () => (dispatch) => dispatch(action.setState({
        ModalAwaitSceptic: { showing: true },
    })),

    // ...
    hideAwaitScepticModal: () => (dispatch) => dispatch(action.setState({
        ModalAwaitSceptic: { showing: false },
    })),

    // ...
    showSpinner: () => (dispatch) => dispatch(action.setState({
        spinnerVisible: true,
    })),

    // ...
    hideSpinner: () => (dispatch) => dispatch(action.setState({
        spinnerVisible: false,
    })),

    // ...
    setTxBody: (txBody) => (dispatch) => dispatch(action.setState({
        txBody,
    })),

    // ...
    setTxSignedBody: (txSignedBody) => (dispatch) => dispatch(action.setState({
        txSignedBody,
    })),

    // ...
    setAccount: (account) => (dispatch) => dispatch(action.setState({
        account,
    })),

    // ...
    setAccountId: (accountId) => (dispatch) => dispatch(action.setState({
        accountId,
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
