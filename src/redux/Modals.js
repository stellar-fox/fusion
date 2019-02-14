import {
    createReducer,
    string,
    toBool,
} from "@xcmats/js-toolbox"




export const modalNames = {
    CONFIRM_DELETE_ACCOUNT: "confirmDeleteAccount",
    REAUTHENTICATE: "reauthenticate",
}




export const MODAL_TOGGLE = "@Modals/TOGGLE"
export const RESET_STATE = "@Modals/RESET_STATE"
export const TOGGLE_ERROR = "@Modals/TOGGLE_ERROR"
export const TOGGLE_PROGRESS = "@Modals/TOGGLE_PROGRESS"




// <Modals> redux tree state
const initState = {
    error: false,
    errorMessage: string.empty(),
    inProgress: false,
    [modalNames.CONFIRM_DELETE_ACCOUNT]: false,
    [modalNames.REAUTHENTICATE]: false,
}




// ...
export const actions = {

    // ...
    resetState: () => ({ type: RESET_STATE }),


    // Turns error indicator on/off in a user input component.
    toggleError: (errorMessage) => ({
        type: TOGGLE_ERROR,
        errorMessage,
    }),


    // toggle modal
    toggleModal: (modalKey, showing) => ({
        type: MODAL_TOGGLE,
        modalKey,
        showing,
    }),


    // toggle "inProgress" state
    toggleProgress: (progress) => ({
        type: TOGGLE_PROGRESS,
        progress,
    }),
}




// ...
export const reducer = createReducer(initState)({

    // ...
    [MODAL_TOGGLE]: (state, action) => ({
        ...state,
        [action.modalKey]: action.showing,
    }),


    // ...
    [RESET_STATE]: () => initState,


    // ...
    [TOGGLE_ERROR]: (state, action) => {
        return ({
            ...state,
            error: toBool(action.errorMessage),
            errorMessage: action.errorMessage,
        })
    },


    // ...
    [TOGGLE_PROGRESS]: (state, action) => ({
        ...state,
        inProgress: action.progress,
    }),

})
