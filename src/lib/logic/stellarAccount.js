/**
 * Fusion.
 *
 * Stellar accounts data helper methods.
 *
 * @module logic-stellarAccounts
 * @license Apache-2.0
 */




import { Networks } from "stellar-sdk"
import { accountType as at } from "../../redux/Accounts"
import { update } from "../../firebase"




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
 * @function getCountOfDemoAccounts
 * @param {Object} stellarAccounts
 * @returns {Number}
 */
export const getCountOfDemoAccounts = (stellarAccounts) =>
    getDemoAccountIds(stellarAccounts).length




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




/**
 * Updates appropriate record in _Firebase Real Time Database_.
 * 
 * @async
 * @param {String} uid Unique _Firebase_ user id.
 * @param {String} accountId
 * @param {String} name Alias string for the account.
 * @returns {Promise} Contains `void` when resolved successfully.
 */
export const updateAccountName = async (uid, accountId, name) =>
    await update(`user/${uid}/stellarAccounts/${accountId}`, { name })
