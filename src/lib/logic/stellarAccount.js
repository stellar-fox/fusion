/**
 * Fusion.
 *
 * Stellar accounts data helper methods.
 *
 * @module stellar-accounts-logic
 * @license Apache-2.0
 */




/**
 * @function getCountOfSigningMethod
 * @param {Object} stellarAccounts
 * @param {String} signingMethod
 * @returns {Number} Count of `signingMethod` type in the account pool.
 */
export const getCountOfSigningMethod = (stellarAccounts, signingMethod) =>
    Object.keys(stellarAccounts).filter((account) =>
        stellarAccounts[account].signingMethods.includes(
            signingMethod
        )
    ).length




/**
 * @function getCountOfAccounts
 * @param {Object} stellarAccounts
 * @returns {Number} Count of accounts created/registered by user.
 */
export const getCountOfAccounts = (stellarAccounts) =>
    Object.keys(stellarAccounts).length




/**
 * @function getSigningMethodsForAccount
 * @param {Object} stellarAccounts
 * @param {String} accountId
 * @returns {Array} Collection of signing methods types for a given `accountId`
 */
export const getSigningMethodsForAccount = (stellarAccounts, accountId) =>
    stellarAccounts[accountId].signingMethods
