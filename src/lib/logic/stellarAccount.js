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
 * Number of real accounts created/registered by user.
 *
 * @function getCountOfRealAccounts
 * @param {Object} stellarAccounts
 * @returns {Number}
 */
export const getCountOfRealAccounts = (stellarAccounts) =>
    getRealAccountIds(stellarAccounts).length




/**
 * Number of demo accounts created/registered by user.
 *
 * @function getCountOfRealAccounts
 * @param {Object} stellarAccounts
 * @returns {Number}
 */
export const getCountOfDemoAccounts = (stellarAccounts) =>
    getDemoAccountIds(stellarAccounts).length




/**
 * Collection of signing methods types for a given real `accountId`.
 *
 * @function getSigningMethodsForRealAccount
 * @param {Object} stellarAccounts
 * @param {String} accountId
 * @returns {Array}
 */
export const getSigningMethodsForRealAccount = (stellarAccounts, accountId) => {
    let
        realAccount = getRealAccounts(stellarAccounts)
            .find((account) => account.accountId === accountId),

        signingMethods = Object.keys(realAccount.signingMethods)
            .map((smKey) => realAccount.signingMethods[smKey].type)

    return signingMethods
}




/**
 * Collection of user created real `accountId`s.
 *
 * @function getRealAccountIds
 * @param {Object} stellarAccounts
 * @returns {Array}
 */
export const getRealAccountIds = (stellarAccounts) =>
    getRealAccounts(stellarAccounts)
        .map((realAccount) => realAccount.accountId)




/**
 * Collection of user created accounts with public network passphrase.
 *
 * @function getRealAccounts
 * @param {Object} stellarAccounts
 * @returns {Array}
 */
export const getRealAccounts = (stellarAccounts) =>
    stellarAccounts ? Object.keys(stellarAccounts)
        .filter((key) =>
            stellarAccounts[key].networkPassphrase === Networks.PUBLIC
        )
        .map((key) => stellarAccounts[key]) : []




/**
 * Collection of signing methods types for a given demo `accountId`.
 *
 * @function getSigningMethodsForDemoAccount
 * @param {Object} stellarAccounts
 * @param {String} accountId
 * @returns {Array}
 */
export const getSigningMethodsForDemoAccount = (stellarAccounts, accountId) => {
    let
        demoAccount = getDemoAccounts(stellarAccounts)
            .find((account) => account.accountId === accountId),

        signingMethods = Object.keys(demoAccount.signingMethods)
            .map((smKey) => demoAccount.signingMethods[smKey].type)

    return signingMethods
}




/**
 * Collection of user created real `accountId`s.
 *
 * @function getDemoAccountIds
 * @param {Object} stellarAccounts
 * @returns {Array}
 */
export const getDemoAccountIds = (stellarAccounts) =>
    getDemoAccounts(stellarAccounts)
        .map((demoAccount) => demoAccount.accountId)




/**
 * Collection of user created accounts with testnet network passphrase.
 *
 * @function getDemoAccounts
 * @param {Object} stellarAccounts
 * @returns {Array}
 */
export const getDemoAccounts = (stellarAccounts) =>
    stellarAccounts ? Object.keys(stellarAccounts)
        .filter((key) =>
            stellarAccounts[key].networkPassphrase === Networks.TESTNET
        )
        .map((key) => stellarAccounts[key]) : []
