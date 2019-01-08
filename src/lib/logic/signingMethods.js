/**
 * Fusion.
 *
 * Signing methods - helper functions.
 *
 * @module logic-signingMethods
 * @license Apache-2.0
 */




/**
 * @function signingMethodCount
 * @param {Object} signingMethods
 * @param {String} signingMethod
 * @returns {Number} Count of `signingMethod` type.
 */
export const signingMethodCount = (signingMethods, signingMethod) => {
    let count = 0
    Object.keys(signingMethods).forEach((accountId) => {
        if (Object.keys(signingMethods[accountId]).includes(signingMethod)) {
            count = count + 1
        }
    })
    return count
}




/**
 * Signing methods available for the _stellar account_.
 * 
 * @function signingMethods
 * @param {Object} signingMethods 
 * @param {String} accountId 
 * @returns {Object}
 */
export const signingMethods = (signingMethods, accountId) =>
    signingMethods[accountId]
