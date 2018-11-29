/**
 * Fusion.
 *
 * Transaction related logic.
 *
 * @module ledgerhq-logic
 * @license Apache-2.0
 */




import { codec } from "@xcmats/js-toolbox"
import {
    Keypair,
    Transaction,
    xdr,
} from "stellar-sdk"




/**
 * Returns true/false depending if a signature string can be decoded from a
 * _base64_ representation.
 *
 * @function validSignature
 * @param {String} b64XdrSig Base64 encoded signature
 * @returns {Boolean}
 */
export const validSignature = (b64XdrSig) => {
    try {
        return codec.b64dec(b64XdrSig).length === 64
    } catch (_) {
        return false
    }
}




/**
 * Returns true/false depending if a signature string can be decoded from a
 * _base64_ representation.
 *
 * @function validDecoratedSignature
 * @param {String} b64XdrSig Base64 encoded signature
 * @returns {Boolean}
 */
export const validDecoratedSignature = (b64XdrSig) => {
    try {
        return codec.b64dec(b64XdrSig).length === 72
    } catch (_) {
        return false
    }
}




/**
 * Builds `DecoratedSignature`. In order to attach it to an existing
 * transaction `tx`, do:
 *
 * ```
 * tx.signatures.push(
 *     xdr.DecoratedSignature.fromXDR([return value of this function])
 * )
 * ```
 *
 * @function decorateSignature
 * @param {String} accountId
 * @param {Uint8Array} xdrSig Base64 encoded signature
 * @returns {Uint8Array} xdr-encoded decorated signature
 */
export const decorateSignature = (accountId, xdrSig) =>
    new xdr.DecoratedSignature({
        hint: Keypair.fromPublicKey(accountId).signatureHint(),
        signature: xdrSig,
    }).toXDR()




/**
 * Returns true/false depending if transaction can be converted from base64
 * encoded xdr envelope to a _Transaction_ object.
 *
 * @function validSignedTransaction
 * @param {String} b64XdrTxEnv _base64_ encoded _xdr_ format of a transaction
 *     envelope.
 * @returns {Boolean}
 */
export const validSignedTransaction = (b64XdrTxEnv) => {
    try {
        let tx = new Transaction(b64XdrTxEnv)
        if (tx.signatures.length > 0) {
            return true
        }
        return false
    } catch (_) {
        return false
    }
}




/**
 * Returns true/false based on validity of _input_.
 * _input_ can be:
 *  - valid base64 encoded transaction
 *  - valid base64 encoded signature
 *  - invalid/not base64 encoded input
 *
 * @function validInput
 * @param {String} input Input string coming from the _input_ html.
 * @returns {Boolean}
 */
export const validInput = (input) =>
    validSignature(input) || validSignedTransaction(input)
