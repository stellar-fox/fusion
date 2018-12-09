/**
 * Fusion.
 *
 * Key onboarding recipe based on _signing method_.
 *
 * @module recipes
 * @license Apache-2.0
 */




import {
    codec,
    func,
    choose,
    string,
} from "@xcmats/js-toolbox"
import {
    action as KeysActions,
    signingMethod as sm,
} from "../../redux/Keys"
import {
    closeShambhala,
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
import { fundAccount } from "../../actions/stellarAccount"
import {
    StrKey,
    Transaction,
} from "stellar-sdk"




/**
 * Run the signup recipe for _Key_ onboarding.
 *
 * @function signup
 * @param {String} signingMethod Signing vector used for delivering signature.
 * @returns {Function} Asynchronous function that will execute the steps of the
 *     recipe in a desired order.
 */
export const signup = (signingMethod) =>
    async (dispatch, _getState) => {
        try {
            await choose(signingMethod, {
                [sm.MANUAL]: async () => {
                    await dispatch(KeysActions.hideSignupScepticModal())
                    await dispatch(KeysActions.showAwaitScepticModal())
                },
                [sm.LEDGERHQ]: async () => {
                    await dispatch(KeysActions.hideSignupLedgerModal())
                    await dispatch(KeysActions.showAwaitLedgerModal())
                },
                [sm.SHAMBHALA]: async () => {
                    await dispatch(KeysActions.hideSignupPureModal())
                    await dispatch(KeysActions.showAwaitPureModal())
                },
            },() => Promise.reject("unknown signing method"))

            dispatch(KeysActions.showSpinner())
            dispatch(setProgressMessage("Querying signing service ..."))
            await dispatch(obtainAccountId())

            dispatch(setProgressMessage(
                "Generating signing keys ..."
            ))
            await dispatch(generateSigningKeys())

            await choose(signingMethod, {
                [sm.MANUAL]: async () => func.identity,
                [sm.LEDGERHQ]: async () => func.identity,
                [sm.SHAMBHALA]: async () => {
                    dispatch(setProgressMessage(
                        "Funding account ..."
                    ))
                    await dispatch(fundAccount())
                },
            },() => Promise.reject("unknown signing method"))

            dispatch(setProgressMessage(
                "Fetching current account data ..."
            ))
            await dispatch(getLatestAccountState())
            await dispatch(tagSigningMethod())

            let tx = null
            let signedTx = null

            await choose(signingMethod, {
                [sm.MANUAL]: async () => {
                    dispatch(setProgressMessage(
                        "Generating transaction body ..."
                    ))

                    tx = await dispatch(generateMultisigTx())

                    await dispatch(closeShambhala())

                    await dispatch(KeysActions.setTxBody(
                        func.pipe(tx)(
                            (t) => t.toEnvelope(),
                            (e) => e.toXDR(),
                            codec.b64enc
                        )))

                    dispatch(setProgressMessage(string.empty()))
                    dispatch(KeysActions.hideSpinner())

                    signedTx = await dispatch(sign(sm.MANUAL, tx))
                },
                [sm.LEDGERHQ]: async () => {
                    dispatch(setProgressMessage(
                        "ACTION REQUIRED. Check your signing device."
                    ))
                    tx = await dispatch(generateMultisigTx())
                    await dispatch(closeShambhala())
                    signedTx = await dispatch(sign(sm.LEDGERHQ, tx))
                },
                [sm.SHAMBHALA]: async () => {
                    dispatch(setProgressMessage(
                        "Creating additional signatures ..."
                    ))
                    signedTx = await dispatch(sign(sm.SHAMBHALA, null))
                    await dispatch(closeShambhala())
                },
            },() => Promise.reject("unknown signing method"))


            if (signingMethod === sm.MANUAL) {
                await dispatch(KeysActions.hideAwaitScepticModal())
                dispatch(KeysActions.showTransactionDetailsModal())
            }
            else {
                await dispatch(setProgressMessage("Submitting ..."))
                await dispatch(submitTransaction(signedTx))
                await dispatch(saveAccountData())
                await dispatch(KeysActions.hideSpinner())
                dispatch(KeysActions.setSucceded())
                dispatch(setProgressMessage("Complete."))
            }


        } catch (error) {
            dispatch(KeysActions.hideSpinner())
            dispatch(setProgressMessage(string.empty()))
            dispatch(KeysActions.setFailed())
            dispatch(setErrorMessage(error.message))
            dispatch(closeShambhala())
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
