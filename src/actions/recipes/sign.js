/**
 * Fusion.
 *
 * Transaction signing recipe based on the _signing method_. There are many
 * ways of signing the transaction so we want to parametrize and abstract the
 * recipe of _signing_ something.
 *
 * @module recipes
 * @license Apache-2.0
 */




import {
    async,
    choose,
    codec,
    func,
    string,
    type,
} from "@xcmats/js-toolbox"
import { action as KeysActions, signingMethod as sm } from "../../redux/Keys"
import {
    Transaction,
    xdr,
} from "stellar-sdk"
import {
    decorateSignature,
    validDecoratedSignature,
    validSignedTransaction,
    validSignature,
} from "../../lib/logic/transaction"
import {
    signTxWithLedgerHQ
} from "../../actions/ledgering"
import {
    generateSignedMultisigTx,
    setTransactionDetails,
} from "../../actions/onboarding"
import { action as AwaiterActions } from "../../redux/Awaiter"




/**
 * @private
 * @constant {Object} context Private memory space
 */
const context = {}




/**
 * Sign transaction based on the signing method.
 *
 * @function sign
 * @param {String} signingMethod Signing vector used for delivering signature.
 * @param {String} transaction Base64 encoded stellar `Transaction`
 * @returns {Function}
 */
export const sign = (signingMethod, transaction) =>
    async (dispatch, _getState) => {

        let signed = await choose(signingMethod, {
            [sm.MANUAL]: async () => {
                let repeat = true
                await async.repeat(async () => {

                    // 1. wait for user input
                    context.signatureInput = async.createMutex()
                    let userInput = await context.signatureInput.lock()

                    // 2. user provided input - so handle it ...
                    let
                        validity = { ok: true },
                        transactionToSubmit = new Transaction(
                            transaction.toEnvelope()
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
                        dispatch(AwaiterActions.setErrorMessage("Invalid input."))

                    } else {
                        //  all good - end this loop
                        repeat = false
                        dispatch(AwaiterActions.setErrorMessage(string.empty()))
                        await dispatch(KeysActions.setTxSignedBody(
                            func.pipe(transactionToSubmit)(
                                (t) => t.toEnvelope(),
                                (e) => e.toXDR(),
                                codec.b64enc
                            )))
                        await dispatch(setTransactionDetails(
                            transactionToSubmit
                        ))
                    }

                }, () => repeat)
            },
            [sm.LEDGERHQ]: async () => {
                return await dispatch(signTxWithLedgerHQ(transaction))
            },
            [sm.SHAMBHALA]: async () => {
                return await dispatch(generateSignedMultisigTx())
            },
        }, () => Promise.reject("unknown signing method"))

        return signed
    }




/**
 * Pass signature to 'signup' recipe.
 *
 * @function passSignature
 * @param {String} signature
 * @returns {Function}
 */
export const passSignature = (signature) =>
    (_dispatch, _getState) => {
        if (type.isObject(context.signatureInput)) {
            context.signatureInput.resolve(signature)
            delete context.signatureInput
        }
    }
