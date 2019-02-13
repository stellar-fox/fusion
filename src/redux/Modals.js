import { createReducer } from "@xcmats/js-toolbox"


export const modalNames = {
    CONFIRM_DELETE_ACCOUNT: "confirmDeleteAccount",
}
export const MODAL_TOGGLE = "@Modals/TOGGLE"


// <Modals> redux tree state
const initState = {
    [modalNames.CONFIRM_DELETE_ACCOUNT]: false,
}


// ...
export const actions = {

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

})
