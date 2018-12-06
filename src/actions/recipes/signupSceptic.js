/**
 * Fusion.
 *
 * Transaction related logic.
 *
 * @module recipe-signup-sceptic
 * @license Apache-2.0
 */




import {
    codec,
    delay,
    func,
    string,
} from "@xcmats/js-toolbox"
import {
    StrKey,
    Transaction,
} from "stellar-sdk"
import {
    action as KeysActions,
    signingMethod as sm,
} from "../../redux/Keys"
import {
    cancel,
    generateMultisigTx,
    generateSigningKeys,
    obtainAccountId,
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
 * Execute the recipe for _Sceptic_ onboarding.
 *
 * @function execute
 * @returns {Function} Asynchronous function that will execute the steps of the
 *     recipe sequentially.
 */
export const execute = () =>
    async (dispatch, _getState) => {
        try {
            await dispatch(KeysActions.hideSignupScepticModal())
            await dispatch(KeysActions.showAwaitScepticModal())

            dispatch(KeysActions.showSpinner())

            dispatch(setProgressMessage(
                "ACTION REQUIRED - Check pop-up window."
            ))
            await dispatch(obtainAccountId())


            dispatch(setProgressMessage(
                "Generating signing keys ..."
            ))
            await dispatch(generateSigningKeys())


            dispatch(setProgressMessage(
                "Fetching account data ..."
            ))
            await dispatch(getLatestAccountState())
            await dispatch(tagSigningMethod())


            dispatch(setProgressMessage(
                "Generating transaction body ..."
            ))

            let generatedTransaction = await dispatch(generateMultisigTx())

            await dispatch(KeysActions.setTxBody(
                func.pipe(generatedTransaction)(
                    (t) => t.toEnvelope(),
                    (e) => e.toXDR(),
                    codec.b64enc
                )))

            dispatch(setProgressMessage(string.empty()))
            dispatch(KeysActions.hideSpinner())

            // sign transaction
            await dispatch(sign(sm.MANUAL, generatedTransaction))

            // go on to next modal to display transaction details
            await dispatch(KeysActions.hideAwaitScepticModal())
            dispatch(KeysActions.showTransactionDetailsModal())

        } catch (error) {
            dispatch(KeysActions.hideSpinner())
            dispatch(setProgressMessage(string.empty()))
            dispatch(setErrorMessage(error.message))
        }


    }




/**
 * Submits pasted signed transaction to the _horizon_.
 *
 * @function submitTx
 * @returns {Function}
 */
export const submitTx = () =>
    async (dispatch, getState) => {
        try {
            dispatch(setErrorMessage(string.empty()))
            dispatch(KeysActions.showSpinner())
            dispatch(setProgressMessage("Submitting transaction ..."))
            dispatch(KeysActions.setState({
                yesButtonDisabled: true,
                noButtonDisabled: true,
            }))
            await dispatch(submitTransaction(
                new Transaction(getState().Keys.txSignedBody)
            ))
            dispatch(KeysActions.setState({
                yesButtonDisabled: false,
                noButtonDisabled: false,
            }))
            await dispatch(KeysActions.hideSpinner())
            dispatch(KeysActions.setSucceded())
            dispatch(setProgressMessage("Complete."))

            await delay(1500)
            dispatch(cancel())

        } catch (error) {
            dispatch(KeysActions.setState({
                yesButtonDisabled: false,
                noButtonDisabled: false,
            }))
            dispatch(KeysActions.hideSpinner())
            dispatch(setProgressMessage(string.empty()))
            dispatch(KeysActions.setFailed())
            dispatch(setErrorMessage(error.message))
            throw new Error(error)
        }
    }




/**
 * Sets user input for account id.
 *
 * @function setAccountId
 * @param {String} accountId
 */
export const setAccountId = (accountId) =>
    (dispatch, _getState) => dispatch(KeysActions.setState({accountId}))




/**
 * Detects validity of _stellar_ `accountId` upon user input and handles UX
 * flow pertaining to the input element as well as ability to proceed further.
 *
 * @function handleAccountIdInput
 * @param {accountId} accountId
 */
export const handleAccountIdInput = (accountId) =>
    async (dispatch, _getState) => {
        if (StrKey.isValidEd25519PublicKey(accountId)) {
            dispatch(setAccountId(accountId))
            dispatch(KeysActions.setState({
                yesButtonDisabled: false,
            }))
            dispatch(setErrorMessage(string.empty()))

        } else {
            dispatch(setErrorMessage("Invalid account id."))
            dispatch(KeysActions.setState({
                yesButtonDisabled: true,
            }))
        }
    }
