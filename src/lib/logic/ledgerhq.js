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
        throw "Platform not supported."
    }

    try {    
        const
            transport = await Transport.create(),
            str = new Str(transport),
            result = await str.getAppConfiguration()
        return result.version
    } catch (error) {
        throw error.message
    } 
}
