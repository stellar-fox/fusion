/**
 * Fusion.
 *
 * Stellar accounts data helper methods.
 *
 * @module stellar-accounts-logic
 * @license Apache-2.0
 */




import { Networks } from "stellar-sdk"




/**
 * @function getCountOfSigningMethod
 * @param {Object} stellarAccounts
 * @param {String} signingMethod
 * @returns {Number} Count of `signingMethod` type in the account pool.
 */
export const getCountOfSigningMethod = (stellarAccounts, signingMethod) =>
    Object.keys(stellarAccounts).filter((account) =>
        Object.keys(stellarAccounts[account].signingMethods).includes(
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
    Object.keys(stellarAccounts[accountId].signingMethods)




/**
 * Collection of user created accounts with public network passphrase.
 *
 * @function getRealAccounts
 * @param {Object} stellarAccounts
 * @returns {Array}
 */
export const getRealAccounts = (stellarAccounts) =>
    Object.keys(stellarAccounts)
        .filter((key) =>
            stellarAccounts[key].networkPassphrase === Networks.PUBLIC
        )
        .map((key) => stellarAccounts[key])




/**
 * Collection of user created accounts with testnet network passphrase.
 *
 * @function getDemoAccounts
 * @param {Object} stellarAccounts
 * @returns {Array}
 */
export const getDemoAccounts = (stellarAccounts) =>
    Object.keys(stellarAccounts)
        .filter((key) =>
            stellarAccounts[key].networkPassphrase === Networks.TESTNET
        )
        .map((key) => stellarAccounts[key])
