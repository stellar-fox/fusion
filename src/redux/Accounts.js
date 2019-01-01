import { createReducer } from "@xcmats/js-toolbox"




// <Accounts> initial state
const initState = {
    tabSelected: 0,
    ModalEditName: {
        showing: false,
    },
}




// state const definitions
export const RESET_STATE = "@Accounts/RESET_STATE"
export const SET_STATE = "@Accounts/SET_STATE"




/**
 * Enumeration of possible account types.
 * REAL, DEMO
 *
 * @constant accountType
 */
export const accountType = Object.freeze({
    REAL: "real",
    DEMO: "demo",
})




// ...
export const action = {

    // ...
    showEditNameModal: () => (dispatch) => dispatch(action.setState({
        ModalEditName: { showing: true },
    })),

    // ...
    hideEditNameModal: () => (dispatch) => dispatch(action.setState({
        ModalEditName: { showing: false },
    })),

    // ...
    changeTab: (tabIndex) => (dispatch) => dispatch(action.setState({
        tabSelected: tabIndex,
    })),

    // ...
    resetState: () => ({ type: RESET_STATE }),

    // ...
    setName: (name) => (dispatch) => dispatch(action.setState({
        name,
    })),

    // ...
    setState: (state) => ({
        type: SET_STATE,
        state,
    }),

    // ...
    updateName: (name) =>
        async (_dispatch, _getState) => {
            console.log("Save account name as: ", name)
        },

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
