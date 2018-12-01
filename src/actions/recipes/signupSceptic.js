/**
 * Fusion.
 *
 * Transaction related logic.
 *
 * @module recipe-signup-sceptic
 * @license Apache-2.0
 */




import {
    async,
    codec,
    delay,
    func,
    string,
    type,
} from "@xcmats/js-toolbox"
import {
    StrKey,
    Transaction,
    xdr,
} from "stellar-sdk"
import { action as KeysActions } from "../../redux/Keys"
import {
    cancelShambhala,
    generateMultisigTx,
    generateSigningKeys,
    obtainAccountId,
    setErrorMessage,
    setProgressMessage,
    setTransactionDetails,
} from "../../actions/onboarding"
import {
    addSigningMethodToAccount,
    getLatestAccountState,
    submitTransaction,
} from "../../actions/stellarAccount"
import {
    decorateSignature,
    validDecoratedSignature,
    validSignedTransaction,
    validSignature,
} from "../../lib/logic/transaction"




/**
 * @private
 * @constant {Object} context Private "signup sceptic" memory space
 */
const context = {}






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
            await dispatch(addSigningMethodToAccount())


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


            let repeat = true
            await async.repeat(async () => {

                // 1. wait for user input
                context.signatureInput = async.createMutex()
                let userInput = await context.signatureInput.lock()

                // 2. user provided input - so handle it ...
                let
                    validity = { ok: true },
                    transactionToSubmit = new Transaction(
                        generatedTransaction.toEnvelope()
                    )

                // 2a. user pasted a "valid signed transaction"
                if (validSignedTransaction(userInput)) {
                    let pastedTransaction = new Transaction(userInput)
                    pastedTransaction.signatures.forEach(
                        (sig) => transactionToSubmit.signatures.push(sig)
                    )
                }

                // 2b. user pasted a "valid signature"
                else if (validSignature(userInput)) {

                    func.pipe(
                        transactionToSubmit.source,
                        codec.b64dec(userInput)
                    )(
                        decorateSignature,
                        (dsXdr) => xdr.DecoratedSignature.fromXDR(dsXdr),
                        (ds) => transactionToSubmit.signatures.push(ds)
                    )
                }

                // 2c. user pasted a "valid decorated signature"
                else if (validDecoratedSignature(userInput)) {

                    func.pipe(userInput)(
                        codec.b64dec,
                        (dsXdr) => xdr.DecoratedSignature.fromXDR(dsXdr),
                        (ds) => transactionToSubmit.signatures.push(ds)
                    )
                }
                else {
                    validity = { error: "Invalid signature input." }
                }


                // 3. inspect horizon validity
                if (!validity.ok) {
                    //  return to beginning
                    dispatch(setErrorMessage("Invalid input."))

                } else {
                    //  all good - end this loop
                    repeat = false
                    dispatch(setErrorMessage(string.empty()))
                    await dispatch(KeysActions.setTxSignedBody(
                        func.pipe(transactionToSubmit)(
                            (t) => t.toEnvelope(),
                            (e) => e.toXDR(),
                            codec.b64enc
                        )))
                    await dispatch(setTransactionDetails(transactionToSubmit))
                }

            }, () => repeat)

            // 4. display transaction details
            await dispatch(KeysActions.hideAwaitScepticModal())
            await dispatch(KeysActions.showTransactionDetailsModal())


            // 5. submit to horizon
            repeat = true
            await async.repeat(async () => {
                await submitTx()
                repeat = false
            }, () => repeat)

            // 6. complete onboarding process UX flow
            await dispatch(setProgressMessage("Complete."))
            await delay(1500)
            dispatch(KeysActions.hideTransactionDetailsModal())
            dispatch(KeysActions.resetState())

        } catch (error) {
            dispatch(KeysActions.hideSpinner())
            dispatch(setProgressMessage(string.empty()))
            dispatch(setErrorMessage(error.message))
        }


    }




/**
 * Pass signature to 'execute' recipe.
 *
 * @function passSignature
 * @param {String} signature
 */
export const passSignature = (signature) =>
    (_dispatch, _getState) => {
        if (type.isObject(context.signatureInput)) {
            context.signatureInput.resolve(signature)
            delete context.signatureInput
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
            dispatch(KeysActions.hideSpinner())
            dispatch(setProgressMessage(string.empty()))
        } catch (error) {
            dispatch(KeysActions.setState({
                yesButtonDisabled: false,
                noButtonDisabled: false,
            }))
            dispatch(setErrorMessage(error.message))
            dispatch(KeysActions.hideSpinner())
            dispatch(setProgressMessage(string.empty()))
            throw new Error(error)
        }
    }





/**
 * Handle user cancel decision.
 *
 * @function cancel
 * @returns {Function} Resets component's state when _Cancel_ is selected.
 */
export const cancel = () =>
    (dispatch, _getState) => {
        dispatch(KeysActions.resetState())
        dispatch(cancelShambhala())
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
