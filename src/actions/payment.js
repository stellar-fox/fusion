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
 * Handle user cancel input on PayModal.
 *
 * @function cancel
 * @returns {Function} Resets component's state when _Cancel_ is selected.
 */
export const cancel = () =>
    async (dispatch, _getState) => {
        dispatch(PayActions.resetState())
    }
