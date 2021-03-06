/**
 * Fusion.
 *
 * _Stellar Account_ actions. Functions in this module pertain to
 * _Stellar Account_ entity. They can query or mutate the account state.
 * Should be used to set the _Redux_ state and called from within UI components.
 *
 * @module actions-stellarAccount
 * @license Apache-2.0
 */




import { func } from "@xcmats/js-toolbox"
import { Network, Networks, Server, Transaction } from "stellar-sdk"
import { action as StellarAccountsActions } from "../redux/StellarAccounts"
import { testNetworkPassphrase } from "../lib/constants"
import { action as KeysActions, signingMethod as sm } from "../redux/Keys"
import { action as AuthActions } from "../redux/Auth"
import { action as UserLoginActions } from "../redux/UserLogin"
import { config } from "../config"
import axios from "axios"
import { firebaseSingleton } from "../firebase"
import { loadAccountState } from "../lib/logic/stellarAccount"
// import { async } from "@xcmats/js-toolbox"




const context = {}


const setEnv = async ({
    network = Networks.TESTNET,
    horizonUrl = "https://horizon-testnet.stellar.org/",
} = {}) => {

    Network.use(new Network(network))
    context.network = network

    context.server = new Server(horizonUrl)
    context.horizonUrl = horizonUrl

    return context

}

setEnv()




/**
 * Fetches balances for the active user accounts directly from _SDF Horizon_.
 * 
 * @function updateBalances
 * @param {String} accountId 
 * @param {String} networkPassphrase 
 * @returns {Function}
 */
export const updateBalances = (accountId, networkPassphrase) =>
    async (dispatch, _getState) => {
        
        let stellarAccount = await loadAccountState(
            accountId, networkPassphrase
        )

        await dispatch(
            StellarAccountsActions.updateBalances(
                stellarAccount.id,
                stellarAccount.balances.find(
                    (balance) => balance.asset_type === "native"
                ),
                stellarAccount.balances.filter(
                    (balance) => balance.asset_type !== "native"
                ),
            )
        )

    }




/**
 * Fetches _Stellar_ accounts that are associated with the current user.
 * 
 * @function detectAccount
 * @param {String} uid Unique _Firebase_ generated user id.
 * @returns {Function}
 */
export const detectAccount = (uid) =>
    async (dispatch, _getState) => {
        firebaseSingleton.database().ref(`user/${uid}/stellarAccounts`)
            .once("value", async (snapshot) => {
                // const snap = snapshot.val()
                // Set initial Firebase stored account state in Redux
                dispatch(StellarAccountsActions.setState({
                    ...snapshot.val(),
                }))

                // await dispatch(await UserLoginActions.setState({
                //     statusMessage: "Fetching latest accounts state ...",
                // }))

                // // load user stellar accounts and their latest state
                // await async.parMap(Object.keys(snap), async (accountId) => {
                //     try {
                //         let stellarAccount = await loadAccountState(
                //             accountId, snap[accountId].networkPassphrase
                //         )
                //         await dispatch(
                //             await StellarAccountsActions.updateBalances(
                //                 stellarAccount.id,
                //                 stellarAccount.balances.find(
                //                     (balance) => balance.asset_type === "native"
                //                 ),
                //                 stellarAccount.balances.filter(
                //                     (balance) => balance.asset_type !== "native"
                //                 ),
                //             )
                //         )
                //     } catch (error) {
                //         // eslint-disable-next-line
                //         console.log(`Error loading ${accountId}: ${error.message}`)
                //     }
                // })

                // done
                await dispatch(AuthActions.setState({ uid }))
                await dispatch(UserLoginActions.resetState())

            })
    }




/**
 * Fetches the latest account state via _horizon_ and stores it under proper
 * key in StellarAccous.
 *
 *  @function getLatestAccountState
 *  @return {Function}
 */
export const getLatestAccountState = () =>
    async (dispatch, getState) => {
        let { accountId } = getState().Keys,
            stellarAccount = await context.server.loadAccount(accountId)

        stellarAccount.networkPassphrase = context.network
        stellarAccount.horizonUrl = context.horizonUrl

        await dispatch(
            StellarAccountsActions.updateAccountState(stellarAccount)
        )

        return stellarAccount
    }




/**
 * Adds chosen signing method to the proper account key under StellarAccounts.
 *
 * @function tagSigningMethod
 * @return {Function}
 */
export const tagSigningMethod = () =>
    async (dispatch, getState) => {
        let { accountId, signingMethod } = getState().Keys,
            account = getState().LedgerHQ.useDefaultAccount ?
                "0" : getState().LedgerHQ.account

        signingMethod === sm.LEDGERHQ ? await dispatch(
            StellarAccountsActions.addSigningMethodWithAccount(
                accountId, signingMethod, account
            )
        ) : await dispatch(StellarAccountsActions.addSigningMethod(
            accountId, signingMethod
        ))

        return signingMethod
    }




/**
 * Based on network passphrase funds the new account with just enough XLM to
 * pay for the operations needed add additional signers on the account as well
 * as deposit for the additional account subentries.
 *
 * @function fundAccount
 * @return {Function}
 */
export const fundAccount = () =>
    async (dispatch, getState) => {
        let { accountId, networkPassphrase } = getState().Keys,
            fundReponse = networkPassphrase === testNetworkPassphrase ?
                await axios.get(config.friendbot.client, {
                    params: { addr: accountId },
                }) : null, /* to be defined */

            balance = func.pipe(fundReponse.data.envelope_xdr)(
                (xdr64) => new Transaction(xdr64),
                (tx) => tx.operations[0],
                (op) => op.startingBalance
            )

        await dispatch(KeysActions.setState({ balance }))

        return balance
    }




/**
 * Submits signed transaction to the _Stellar Network_ via _horizon_.
 *
 * @function submitTransaction
 * @param {Transaction} tx Signed transaction to be submitted to the network.
 * @return {Function}
 */
export const submitTransaction = (tx) =>
    async (_dispatch, _getState) =>
        await context.server.submitTransaction(tx)
