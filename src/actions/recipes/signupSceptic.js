/**
 * Fusion.
 *
 * Transaction related logic.
 *
 * @module recipe-signup-sceptic
 * @license Apache-2.0
 */



import { action as KeysActions } from "../../redux/Keys"




/**
 * @function execute Execute the recipe for _Sceptic_ onboarding.
 * @returns {Function} Asynchronous function that will execute the steps of the
 * recipe sequentially.
 */
export const execute = () =>
    async (dispatch, _getState) => {
        await dispatch(KeysActions.hideSignupScepticModal())
        await dispatch(KeysActions.showAwaitScepticModal())
    }




/**
 * @function cancel Handle user cancel decision.
 * @returns {Function} Resets component's state when _Cancel_ is selected.
 */
export const cancel = () =>
    (dispatch, _getState) => dispatch(KeysActions.resetState())




/**
 * @function setAccountId Sets user input for account id.
 * @param {String} accountId
 */
export const setAccountId = (accountId) =>
    (dispatch, _getState) => dispatch(KeysActions.setState({accountId}))
