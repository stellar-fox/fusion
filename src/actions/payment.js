/**
 * Fusion.
 *
 * Represents an action set that manipulates _Redux_ state. The actions in this
 * module reflect user interaction with the front-end elements during
 * payment related actions.
 *
 * @module pay-actions
 * @license Apache-2.0
 */




import { action as PayActions } from "../redux/Pay"




/**
 * Handle user cancel input on PayModal. Resets component's state when _Cancel_
 *  is selected.
 *
 * @function cancel
 * @returns {Function}
 */
export const cancel = () =>
    async (dispatch, _getState) => {
        await dispatch(hideModalPay())
        dispatch(PayActions.resetState())
    }




/**
 * Show modal for making payments.
 *
 * @function showModalPay
 * @returns {Function}
 */
export const showModalPay = () =>
    async (dispatch, _getState) =>
        dispatch(PayActions.setState({ ModalPay: { showing: true }}))




/**
 * Hide modal used for making payments.
 * @function hideModalPay
 * @returns {Function}
 */
export const hideModalPay = () => (dispatch) =>
    dispatch(PayActions.setState({
        ModalPay: { showing: false },
    }))




/**
 * Sets source `accountId`.
 *
 * @function setSource
 * @param {String} source `AccountId`, which is originating the payment.
 * @returns {Function}
 */
export const setSource = (source) =>
    async (dispatch, _getState) => dispatch(PayActions.setState({
        source,
    }))




/**
 * Sets account type _live_ or _demo_.
 *
 * @function setAccountType
 * @param {String} accountType One of the account types REAL | DEMO.
 * @returns {Function}
 */
export const setAccountType = (accountType) =>
    async (dispatch, _getState) => dispatch(PayActions.setState({
        accountType,
    }))




/**
 * Sets destination `accountId`.
 *
 * @function setDestination
 * @param {String} destination `AccountId` of the destination.
 * @returns {Function}
 */
export const setDestination = (destination) =>
    async (dispatch, _getState) => dispatch(PayActions.setState({
        destination,
    }))




/**
 * Sets amount.
 *
 * @function setAmount
 * @param {String} amount
 * @returns {Function}
 */
export const setAmount = (amount) =>
    async (dispatch, _getState) => dispatch(PayActions.setState({
        amount,
    }))




/**
 * Sets memo.
 *
 * @function setMemo
 * @param {String} memo
 * @returns {Function}
 */
export const setMemo = (memo) =>
    async (dispatch, _getState) => dispatch(PayActions.setState({
        memo,
    }))




/**
 * Sets signing method.
 *
 * @function setSigningMethod
 * @param {String} signingMethod Signing provider to be used.
 * @returns {Function}
 */
export const setSigningMethod = (signingMethod) =>
    async (dispatch, _getState) => dispatch(PayActions.setState({
        signingMethod,
    }))
