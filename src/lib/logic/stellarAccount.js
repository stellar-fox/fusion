/**
 * Fusion.
 *
 * Stellar accounts data helper methods.
 *
 * @module stellar-accounts-logic
 * @license Apache-2.0
 */




import { Networks } from "stellar-sdk"
import { accountType as at } from "../../redux/Accounts"






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




/**
 * Determines account type using network passphrase.
 * 
 * @function getAccountType
 * @param {Object} stellarAccounts 
 * @param {String} accountId 
 * @returns {String}
 */
export const getAccountType = (stellarAccounts, accountId) =>
    stellarAccounts[accountId].networkPassphrase === Networks.PUBLIC ?
        at.REAL : at.DEMO




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
 * Signing methods available for the _stellar account_.
 * 
 * @function getSigningMethodsForAccount
 * @param {Object} signingMethods 
 * @param {String} accountId 
 * @returns {Object}
 */
export const getSigningMethodsForAccount = (signingMethods, accountId) =>
    signingMethods[accountId]




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
        .filter((accountId) =>
            stellarAccounts[accountId].networkPassphrase === Networks.PUBLIC
        )
        .map((accountId) => stellarAccounts[accountId]) : []




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
