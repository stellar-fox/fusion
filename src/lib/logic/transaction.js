/**
 * Fusion.
 *
 * Transaction related logic.
 *
 * @module ledgerhq-logic
 * @license Apache-2.0
 */


import { codec } from "@xcmats/js-toolbox"
import { xdr } from "stellar-sdk"



/**
 * @function
 * @param {String} signature Base64 encoded signature
 * @returns {Boolean}
 */
export const validSignature = (signature) => {
    try {
        codec.b64dec(signature)
        return true
    } catch (error) {
        return false
    }
}




/**
 * @function
 * @param {String} transaction Base64 encoded transaction envelope
 * @returns {Boolean}
 */
export const validTransaction = (transaction) => {
    try {
        xdr.TransactionEnvelope.fromXDR(codec.b64dec(transaction))
        return true
    } catch (error) {
        return false
    }
}




/**
 * @function
 * @param {String} input Input string coming from the _input_ html.
 * @returns {Boolean}
 */
export const validInput = (input) => {
    // input can be:
    //  - valid base64 encoded transaction
    //  - valid base64 encoded signature
    //  - invalid/not base64 encoded input

    const
        signature = validSignature(input),
        transaction = validTransaction(input)

    if (signature) {
        return true
    }

    if (transaction) {
        return true
    }

    return false
}
