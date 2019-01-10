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
} from "../../actions/onboarding"
import { action as AccountsActions } from "../../redux/Accounts"
import { action as AwaiterActions } from "../../redux/Awaiter"
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

            dispatch(AwaiterActions.showSpinner())
            dispatch(AwaiterActions.setProgressMessage("Querying signing service ..."))
            await dispatch(obtainAccountId())

            dispatch(AwaiterActions.setProgressMessage(
                "Generating signing keys ..."
            ))
            await dispatch(generateSigningKeys())

            await choose(signingMethod, {
                [sm.MANUAL]: async () => func.identity,
                [sm.LEDGERHQ]: async () => func.identity,
                [sm.SHAMBHALA]: async () => {
                    dispatch(AwaiterActions.setProgressMessage(
                        "Funding account ..."
                    ))
                    await dispatch(fundAccount())
                },
            },() => Promise.reject("unknown signing method"))

            dispatch(AwaiterActions.setProgressMessage(
                "Fetching current account data ..."
            ))
            await dispatch(getLatestAccountState())
            await dispatch(tagSigningMethod())

            let tx = null
            let signedTx = null

            await choose(signingMethod, {
                [sm.MANUAL]: async () => {
                    dispatch(AwaiterActions.setProgressMessage(
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

                    dispatch(AwaiterActions.setProgressMessage(string.empty()))
                    dispatch(AwaiterActions.hideSpinner())

                    signedTx = await dispatch(sign(sm.MANUAL, tx))
                },
                [sm.LEDGERHQ]: async () => {
                    dispatch(AwaiterActions.setProgressMessage(
                        "ACTION REQUIRED. Check your signing device."
                    ))
                    tx = await dispatch(generateMultisigTx())
                    await dispatch(closeShambhala())
                    signedTx = await dispatch(sign(sm.LEDGERHQ, tx))
                },
                [sm.SHAMBHALA]: async () => {
                    dispatch(AwaiterActions.setProgressMessage(
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
                await dispatch(AwaiterActions.setProgressMessage("Submitting ..."))
                await dispatch(submitTransaction(signedTx))
                await dispatch(saveAccountData())
                await dispatch(AwaiterActions.hideSpinner())
                dispatch(AwaiterActions.setSucceded())
                dispatch(AwaiterActions.setProgressMessage("Complete."))
            }


        } catch (error) {
            dispatch(AwaiterActions.hideSpinner())
            dispatch(AwaiterActions.setProgressMessage(string.empty()))
            dispatch(AwaiterActions.setFailed())
            dispatch(AwaiterActions.setErrorMessage(error.message))
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
            dispatch(AwaiterActions.setErrorMessage(string.empty()))
            dispatch(AwaiterActions.showSpinner())
            dispatch(AwaiterActions.setProgressMessage("Submitting transaction ..."))
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
            await dispatch(AwaiterActions.hideSpinner())
            dispatch(AwaiterActions.setSucceded())
            dispatch(AwaiterActions.setProgressMessage("Complete."))

        } catch (error) {
            dispatch(KeysActions.setState({
                yesButtonDisabled: false,
                noButtonDisabled: false,
            }))
            dispatch(AwaiterActions.hideSpinner())
            dispatch(AwaiterActions.setProgressMessage(string.empty()))
            dispatch(AwaiterActions.setFailed())
            dispatch(AwaiterActions.setErrorMessage(error.message))
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
            dispatch(AwaiterActions.setErrorMessage(string.empty()))
            dispatch(AccountsActions.setState({
                error: false,
                errorMessage: string.empty(),
            }))

        } else {
            dispatch(AwaiterActions.setErrorMessage("Invalid account id."))
            dispatch(AccountsActions.setState({
                error: true,
                errorMessage: "Invalid Account ID.",
            }))
            dispatch(KeysActions.setState({
                yesButtonDisabled: true,
            }))
        }
    }
