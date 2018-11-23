/**
 * Fusion.
 *
 * Ledger Nano S interaction logic.
 *
 * @module ledgerhq-logic
 * @license Apache-2.0
 */

import Transport from "@ledgerhq/hw-transport-u2f"
import Str from "@ledgerhq/hw-app-str"
import { Keypair, xdr } from "stellar-sdk"




/**
 * Statically check if a transport is supported on the user's platform/browser.
 *
 * @async
 * @function isSupported
 * @return {Function}
 */
export const isSupported = async () => Transport.isSupported()




/**
 * Establishing connection to the Ledger device and query it
 * for the current software version of the installed _Stellar_ application.
 *
 * @async
 * @function getSoftwareVersion
 * @returns {Function}
 */
export const getSoftwareVersion = async () => {
    if (!await Transport.isSupported()) {
        throw new Error("Platform not supported.")
    }

    try {
        const
            transport = await Transport.create(),
            str = new Str(transport),
            result = await str.getAppConfiguration()
        return result.version
    } catch (error) {
        throw error
    }
}




/**
 * Gets _Stellar_ `accountId` from the _Ledger Nano S_ device based on
 * _BIP-32_ derivation path provided as String argument [e.g. 44'/148'/0']
 *
 * @async
 * @function getAccountId
 * @param {Number} [account=0] Account of the derivation path.
 * @returns {String}
 */
export const getAccountId = async (account="0") => {
    const
        transport = await Transport.create(),
        str = new Str(transport),
        result = await str.getPublicKey(`44'/148'/${account}'`)

    return result.publicKey
}




/**
 * Returns signed transaction with a signature for the account specified by
 * BIP-32 derivation path (account part) and _Stellar_ `accountId`.
 *
 * @async
 * @function signTransaction
 * @param {Transaction} transaction Transaction to be signed.
 * @param {String} accountId _Stellar_ `accountId` (public key).
 * @param {Number} [account=0] _BIP-32_ account part of derivation path.
 * @returns {String}
 */
export const signTransaction = async (transaction, accountId, account="0") => {
    const
        transport = await Transport.create(),
        str = new Str(transport),
        signature = (await str.signTransaction(
            `44'/148'/${account}'`,
            transaction.signatureBase()
        )).signature,
        keyPair = Keypair.fromPublicKey(accountId),
        hint = keyPair.signatureHint(),
        decorated = new xdr.DecoratedSignature({ hint, signature })

    transaction.signatures.push(decorated)

    return transaction
}
