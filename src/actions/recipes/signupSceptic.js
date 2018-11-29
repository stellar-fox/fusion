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
    cancelShambhala, generateSigningKeys, generateMultisigTx, obtainAccountId,
    setErrorMessage
} from "../../actions/onboarding"
import {
    addSigningMethodToAccount, getLatestAccountState
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


            let repeat = true
            await async.repeat(async () => {

                // 0. jump back to here on error
                dispatch(KeysActions.hideSpinner())

                // 1. wait for user input
                context.signatureInput = async.createMutex()
                let userInput = await context.signatureInput.lock()

                // 2. user provided input - so handle it
                dispatch(KeysActions.showSpinner())

                // 3. biore te sygnature i podpinam do mojej transakcji
                let
                    response = null,
                    transactionToSubmit = new Transaction(
                        generatedTransaction.toEnvelope()
                    )

                // 3a. user pasted a "valid signed transaction"
                if (validSignedTransaction(userInput)) {
                    let pastedTransaction = new Transaction(userInput)
                    pastedTransaction.signatures.forEach(
                        (sig) => transactionToSubmit.signatures.push(sig)
                    )
                    // ... submit to horizon
                    response = { ok: true }
                }

                // 3b. user pasted a "valid signature"
                else if (validSignature(userInput)) {

                    func.pipe(
                        transactionToSubmit.source,
                        codec.b64dec(userInput)
                    )(
                        decorateSignature,
                        (dsXdr) => xdr.DecoratedSignature.fromXDR(dsXdr),
                        (ds) => transactionToSubmit.signatures.push(ds)
                    )
                    // ... submit to horizon
                    response = { ok: true }
                }

                // 3c. user pasted a "valid decorated signature"
                else if (validDecoratedSignature(userInput)) {

                    func.pipe(userInput)(
                        codec.b64dec,
                        (dsXdr) => xdr.DecoratedSignature.fromXDR(dsXdr),
                        (ds) => transactionToSubmit.signatures.push(ds)
                    )
                    // ... submit to horizon
                    response = { ok: true }
                }
                else {
                    response = { error: "Invalid signature input." }
                }


                // 4. inspect horizon response
                if (!response.ok) {
                    //  jump back to "0"
                } else {
                    repeat = false
                    //  all good - end this loop
                    dispatch(KeysActions.hideSpinner())
                }

            }, () => repeat)

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
