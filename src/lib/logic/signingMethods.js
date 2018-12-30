/**
 * Fusion.
 *
 * Signing methods - helper functions.
 *
 * @module signing-methods-logic
 * @license Apache-2.0
 */




/**
 * @function getCountOfSigningMethodType
 * @param {Object} signingMethods
 * @param {String} signingMethod
 * @returns {Number} Count of `signingMethod` type.
 */
export const getCountOfSigningMethodType = (signingMethods, signingMethod) => {
    let count = 0
    Object.keys(signingMethods).forEach((accountId) => {
        if (Object.keys(signingMethods[accountId]).includes(signingMethod)) {
            count = count + 1
        }
    })
    return count
}
