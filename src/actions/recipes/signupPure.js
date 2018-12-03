/**
 * Fusion.
 *
 * Transaction related logic.
 *
 * @module recipe-signup-pure
 * @license Apache-2.0
 */


import {
    delay,
    string,
} from "@xcmats/js-toolbox"
import { action as KeysActions } from "../../redux/Keys"
import {
    generateSigningKeys,
    obtainAccountId,
    saveAccountData,
    setErrorMessage,
    setProgressMessage,
    generateSignedMultisigTx,
} from "../../actions/onboarding"
import {
    addSigningMethodToAccount,
    getLatestAccountState,
    submitTransaction,
} from "../../actions/stellarAccount"
import { fundAccount } from "../../actions/stellarAccount"




/**
 * Execute the recipe for _Pure_ onboarding.
 *
 * @function execute
 * @returns {Function} Asynchronous function that will execute the steps of the
 *     recipe in a desired order.
 */
export const execute = () =>
    async (dispatch, _getState) => {
        try {

            await dispatch(KeysActions.hideSignupPureModal())
            await dispatch(KeysActions.showAwaitPureModal())

            dispatch(KeysActions.showSpinner())
            dispatch(setProgressMessage(
                "ACTION REQUIRED. Check pop-up window."
            ))
            await dispatch(obtainAccountId())

            dispatch(setProgressMessage(
                "Generating signatures ..."
            ))
            await dispatch(generateSigningKeys())

            dispatch(setProgressMessage(
                "Funding account ..."
            ))
            await dispatch(fundAccount())

            await dispatch(getLatestAccountState())
            await dispatch(addSigningMethodToAccount())

            dispatch(setProgressMessage(
                "Creating additional signatures ..."
            ))
            const signedTx = await dispatch(generateSignedMultisigTx())
            await dispatch(submitTransaction(signedTx))

            await dispatch(saveAccountData())

            await dispatch(KeysActions.hideSpinner())
            dispatch(KeysActions.setSucceded())
            dispatch(setProgressMessage("Complete."))

            await delay(1500)
            dispatch(KeysActions.hideAwaitPureModal())

        } catch (error) {
            dispatch(KeysActions.hideSpinner())
            dispatch(setProgressMessage(string.empty()))
            dispatch(KeysActions.setFailed())
            dispatch(setErrorMessage(error.message))
        }

    }
