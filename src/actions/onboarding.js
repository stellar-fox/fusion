/**
 * Fusion.
 *
 * Onboarding logic.
 *
 * @module onboarding-actions
 * @license Apache-2.0
 */




import { func } from "@xcmats/js-toolbox"
import { Shambhala } from "../lib/shambhala.client"
import { action as KeysActions, signingMethod as sm } from "../redux/Keys"
import { config } from "../firebase/config"
import { testNetworkPassphrase } from "../lib/constants"
import axios from "axios"
import { Network, Networks, Server, Transaction } from "stellar-sdk"




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
 * ...
 *
 * @param {String} signingMethod
 * @return {Function}
 */
export const setSigningMethod = (signingMethod) =>
    async (dispatch, _getState) =>
        await dispatch(KeysActions.setState({ signingMethod }))




/**
 * ...
 *
 * @param {String} progressMessage
 * @return {Function}
 */
export const setProgressMessage = (progressMessage) =>
    async (dispatch, _getState) =>
        await dispatch(KeysActions.setState({ progressMessage }))




/**
 * ...
 *
 * @return {Function}
 */
export const generateAccountId = () =>
    async (dispatch, getState) => {
        let
            { signingMethod } = getState().Keys,
            { jwt } = getState().Auth,

            accountId = await func.choose(signingMethod, {

                [sm.MANUAL]: () =>
                    Promise.reject("NOT IMPLEMENTED YET"),

                [sm.LEDGERHQ]: () =>
                    Promise.reject("NOT IMPLEMENTED YET"),

                [sm.SHAMBHALA]:
                    new Shambhala(config.shambhala.client, { token: jwt })
                        .generateAddress,

            }, () => Promise.reject("unknown signing method"))

        await dispatch(KeysActions.setState({ accountId }))

        return accountId
    }




/**
 * ...
 *
 * @return {Function}
 */
export const generateSigningKeys = () =>
    async (dispatch, getState) => {
        let
            { accountId } = getState().Keys,
            { jwt } = getState().Auth,
            signingKeys = await new Shambhala(
                config.shambhala.client,
                { token: jwt }
            ).generateSigningKeys(accountId)

        // TODO: remove later - leave now for debugging/testing
        await dispatch(KeysActions.setState({ signingKeys }))

        return signingKeys
    }




/**
 *  ...
 *  @return {Function}
 */
export const fundAccount = () =>
    async (dispatch, getState) => {
        let
            { accountId, networkPassphrase } = getState().Keys,

            fundReponse = networkPassphrase === testNetworkPassphrase ?
                await axios.get("https://friendbot.stellar.org/", {
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
 *  ...
 *  @return {Function}
 */
export const generateMultisig = () =>
    async (dispatch, getState) => {
        try {
            let
                { jwt } = getState().Auth,
                { accountId } = getState().Keys,
                { networkPassphrase, sequence } = getState().StellarAccounts[accountId],
                tx = await new Shambhala(
                    config.shambhala.client,
                    { token: jwt }
                ).generateSignedKeyAssocTX(accountId, sequence, networkPassphrase),
                serverResponse = await context.server.submitTransaction(tx)
            await dispatch(KeysActions.setState({ serverResponse }))
        } catch (error) {
            await dispatch(KeysActions.setState({ serverResponse: error }))
        }

        return true
    }
