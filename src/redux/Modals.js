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
export const TOGGLE_ERROR = "@Modals/TOGGLE_ERROR"




// <Modals> redux tree state
const initState = {
    error: false,
    errorMessage: string.empty(),
    [modalNames.CONFIRM_DELETE_ACCOUNT]: false,
    [modalNames.REAUTHENTICATE]: false,
}




// ...
export const actions = {

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

}




// ...
export const reducer = createReducer(initState)({

    // ...
    [MODAL_TOGGLE]: (state, action) => ({
        ...state,
        [action.modalKey]: action.showing,
    }),


    // ...
    [TOGGLE_ERROR]: (state, action) => {
        return ({
            ...state,
            error: toBool(action.errorMessage),
            errorMessage: action.errorMessage,
        })
    },

})
