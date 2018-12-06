/**
 * Fusion.
 *
 * Onboarding related logic using LedgerHQ device.
 *
 * @module recipe-signup-ledger
 * @license Apache-2.0
 */




import {
    delay,
    string,
} from "@xcmats/js-toolbox"
import {
    action as KeysActions,
    signingMethod as sm,
} from "../../redux/Keys"
import {
    cancel,
    generateMultisigTx,
    generateSigningKeys,
    obtainAccountId,
    saveAccountData,
    setErrorMessage,
    setProgressMessage,
} from "../../actions/onboarding"
import {
    tagSigningMethod,
    getLatestAccountState,
    submitTransaction,
} from "../../actions/stellarAccount"
import { sign } from "../recipes/sign"




/**
 * Execute the recipe for _Ledger_ onboarding.
 *
 * @function execute
 * @returns {Function} Asynchronous function that will execute the steps of the
 *     recipe in a desired order.
 */
export const execute = () =>
    async (dispatch, _getState) => {
        try {

            await dispatch(KeysActions.hideSignupLedgerModal())
            await dispatch(KeysActions.showAwaitLedgerModal())

            dispatch(KeysActions.showSpinner())
            dispatch(setProgressMessage("Querying signing service ..."))
            await dispatch(obtainAccountId())

            dispatch(setProgressMessage(
                "ACTION REQUIRED. Check pop-up window."
            ))
            await dispatch(generateSigningKeys())

            dispatch(setProgressMessage(
                "Fetching current account data ..."
            ))
            await dispatch(getLatestAccountState())
            await dispatch(tagSigningMethod())

            dispatch(setProgressMessage(
                "ACTION REQUIRED. Check your signing device."
            ))
            const tx = await dispatch(generateMultisigTx())
            const signedTx = await dispatch(sign(sm.LEDGERHQ, tx))

            await dispatch(setProgressMessage(
                "Submitting ..."
            ))
            await dispatch(submitTransaction(signedTx))

            await dispatch(saveAccountData())

            await dispatch(KeysActions.hideSpinner())
            dispatch(KeysActions.setSucceded())
            dispatch(setProgressMessage("Complete."))

            await delay(1500)
            dispatch(cancel())

        } catch (error) {
            dispatch(KeysActions.hideSpinner())
            dispatch(setProgressMessage(string.empty()))
            dispatch(KeysActions.setFailed())
            dispatch(setErrorMessage(error.message))
        }

    }
