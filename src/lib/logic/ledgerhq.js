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



/**
 * Statically check if a transport is supported on the user's platform/browser.
 *
 * @async
 * @return {Function}
 */
export const isSupported = async () => Transport.isSupported()


/**
 * Establishing connection to the Ledger device and query it
 * for the current software version of the installed _Stellar_ application.
 *
 * @async
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
 * Gets Stellar `accountId` from the _Ledger Nano S_ device based on
 * _BIP-32_ derivation path provided as String argument [e.g. 44'/148'/0']
 *
 * @async
 * @param {Number} [0] Account of the derivation path.
 * @returns {String}
 */
export const getAccountId = async (account=0) => {
    const
        transport = await Transport.create(),
        str = new Str(transport),
        result = await str.getPublicKey(`44'/148'/${account}'`)

    return result.publicKey
}
