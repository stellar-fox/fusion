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


            dispatch(KeysActions.setState({
                progressMessage: "ACTION REQUIRED - Check pop-up window.",
            }))
            await dispatch(obtainAccountId())


            dispatch(KeysActions.setState({
                progressMessage: "Generating signing keys ...",
            }))
            await dispatch(generateSigningKeys())


            dispatch(KeysActions.setState({
                progressMessage: "Fetching account data ...",
            }))
            await dispatch(getLatestAccountState())
            await dispatch(addSigningMethodToAccount())


            dispatch(KeysActions.setState({
                progressMessage: "Generating transaction body ...",
            }))

            let generatedTransaction = await dispatch(generateMultisigTx())

            await dispatch(KeysActions.setTxBody(
                func.pipe(generatedTransaction)(
                    (t) => t.toEnvelope(),
                    (e) => e.toXDR(),
                    codec.b64enc
                )))

            dispatch(KeysActions.setState({
                progressMessage: string.empty(),
            }))

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
            context.submitTx = async.createMutex()
            let horizonResponse = await context.submitTx.lock()
            dispatch(KeysActions.setState({ horizonResponse }))
            await dispatch(KeysActions.progressMessage("Complete."))
            await delay(1500)
            dispatch(KeysActions.hideTransactionDetailsModal())

        } catch (error) {
            dispatch(KeysActions.hideSpinner())
            dispatch(KeysActions.setState({
                progressMessage: string.empty(),
            }))
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

        if (type.isObject(context.submitTx)) {

            let horizonResponse = null
            try {
                await dispatch(KeysActions.showSpinner())
                await dispatch(setProgressMessage("Submitting transaction ..."))
                horizonResponse = await dispatch(
                    submitTransaction(new Transaction(getState().Keys.txSignedBody))
                )
                await dispatch(KeysActions.hideSpinner())
                await dispatch(setProgressMessage(string.empty()))
            } catch (error) {
                await dispatch(setErrorMessage(error.message))
                await dispatch(KeysActions.hideSpinner())
                await dispatch(setProgressMessage(string.empty()))
            } finally {
                context.submitTx.resolve(horizonResponse)
                delete context.submitTx
            }

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
