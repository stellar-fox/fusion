/**
 * Fusion.
 *
 * Stellar accounts data helper methods.
 *
 * @module logic-stellarAccounts
 * @license Apache-2.0
 */




import { accountType as at } from "../../redux/Accounts"
import { update } from "../../firebase"
import {
    Network,
    Networks,
    Server,
} from "stellar-sdk"
import BigNumber from "bignumber.js"




const context = {}

const setEnvDemo = async ({
    network = Networks.TESTNET,
    horizonUrl = "https://horizon-testnet.stellar.org/",
} = {}) => {

    Network.use(new Network(network))
    context.networkDemo = network

    context.serverDemo = new Server(horizonUrl)
    context.horizonUrlDemo = horizonUrl

    return context

}


const setEnvReal = async ({
    network = Networks.PUBLIC,
    horizonUrl = "https://horizon.stellar.org/",
} = {}) => {

    Network.use(new Network(network))
    context.networkReal = network

    context.serverReal = new Server(horizonUrl)
    context.horizonUrlReal = horizonUrl

    return context

}

setEnvDemo()
setEnvReal()



export const loadAccountState = async (accountId, networkPassphrase) => 
    await networkPassphrase === Networks.PUBLIC ?
        context.serverReal.loadAccount(accountId) :
        context.serverDemo.loadAccount(accountId)




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
 * @function updateAccountName
 * @param {String} uid Unique _Firebase_ user id.
 * @param {String} accountId
 * @param {String} name Alias string for the account.
 * @returns {Promise} Contains `void` when resolved successfully.
 */
export const updateAccountName = async (uid, accountId, name) =>
    await update(`user/${uid}/stellarAccounts/${accountId}`, { name })




/**
 * @function totalForAllAccounts
 * @param {Array} accountIds Holds ids of real or demo accounts.
 * @param {Object} stellarAccounts Holds user stellar accounts.
 * @returns {String} Total balance for all user's _stellar_ accounts (demo | real).
 */
export const totalForAllAccounts = (accountIds, stellarAccounts) =>
    accountIds.map((
        accountId => stellarAccounts[accountId].nativeBalance.balance
    )).reduce((a, b) => {
        let bna = BigNumber(a)
        let bnb = BigNumber(b)
        return bna.plus(bnb).toFixed(7)
    }, 0)




/**
 * Calculates available balance for the account by subtracting current liabilities.
 * 
 * @function availableBalance
 * @param {String} accountId
 * @param {Object} stellarAccounts HOlds user stellar accounts.
 */
export const availableBalance = (accountId, stellarAccounts) => {
    let balance = BigNumber(stellarAccounts[accountId].nativeBalance.balance)
    let buyingLiabilities = BigNumber(stellarAccounts[accountId]
        .nativeBalance.buying_liabilities)
    let sellingLiabilities = BigNumber(stellarAccounts[accountId]
        .nativeBalance.selling_liabilities)
    return balance.minus(buyingLiabilities).minus(sellingLiabilities).toFixed(7)
}
