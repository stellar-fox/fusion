/**
 * Fusion.
 *
 * Stellar _Account_ logic.
 *
 * @module onboarding-actions
 * @license Apache-2.0
 */




import { Network, Networks, Server } from "stellar-sdk"
import { action as StellarAccountsActions } from "../redux/StellarAccounts"



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
 *  ...
 *  @return {Function}
 */
export const getSequenceNumber = () =>
    async (dispatch, getState) => {
        let
            { accountId } = getState().Keys,
            stellarAccount = await context.server.loadAccount(accountId)

        await dispatch(StellarAccountsActions.addAccount(stellarAccount))

        return stellarAccount
    }
