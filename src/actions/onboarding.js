/**
 * Fusion.
 *
 * Represents an action set that manipulates _Redux_ state. The actions in this
 * module reflect user interaction with the front-end elements during
 * key management.
 *
 * @module onboarding-actions
 * @license Apache-2.0
 */




import { func } from "@xcmats/js-toolbox"
import { Shambhala } from "../lib/shambhala.client"
import { action as KeysActions, signingMethod as sm } from "../redux/Keys"
import { config } from "../firebase/config"
import { Network, Networks, Server, Transaction } from "stellar-sdk"
import { getAccountId, getSoftwareVersion } from "../lib/logic/ledgerhq"
import { action as LedgerHQActions } from "../redux/LedgerHQ"




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
 * Sets _redux_ state signifying current chosen method of onboarding a new key.
 *
 * @function setSigningMethod
 * @param {String} signingMethod
 * @return {Function}
 */
export const setSigningMethod = (signingMethod) =>
    async (dispatch, _getState) =>
        await dispatch(KeysActions.setState({ signingMethod }))




/**
 * Updates _redux_ state holding the current progress message during onboarding.
 *
 * @function setProgressMessage
 * @param {String} progressMessage Current progress message to be set.
 * @return {Function}
 */
export const setProgressMessage = (progressMessage) =>
    async (dispatch, _getState) =>
        await dispatch(KeysActions.setState({ progressMessage }))




/**
 * Updates _redux_ state holding the possible error message during onboarding.
 *
 * @function setErrorMessage
 * @param {String} errorMessage Error message to be set.
 * @return {Function}
 */
export const setErrorMessage = (errorMessage) =>
    async (dispatch, _getState) =>
        await dispatch(KeysActions.setState({ errorMessage }))




/**
 * Depending on a method of onboarding it executes
 * a set of actions in order to obtain an account number that will be
 * associated with the Shambhala signing mechanism.
 *
 * @function obtainAccountId
 * @return {Function}
 */
export const obtainAccountId = () =>
    async (dispatch, getState) => {

        let
            { signingMethod } = getState().Keys,
            { useDefaultAccount, account } = getState().LedgerHQ,
            { jwt } = getState().Auth,

            accountId = await func.choose(signingMethod, {

                [sm.MANUAL]: new Shambhala(
                    config.shambhala.client, { token: jwt }
                ).associateAddress(getState().Keys.accountId),


                // at this time it not only obtains the account number from the
                // Ledger Nano S device but also queries for its software
                // version and sets it within LedgerHQ redux namespace
                [sm.LEDGERHQ]: async () => {
                    const softwareVersion = await getSoftwareVersion()
                    await dispatch(LedgerHQActions.setState({
                        softwareVersion,
                    }))

                    return new Shambhala(
                        config.shambhala.client, { token: jwt }
                    ).associateAddress(
                        useDefaultAccount ? await getAccountId() :
                            await getAccountId(account)
                    )

                },


                // generates random account number to be associated with
                // shambhala signing mechanism
                [sm.SHAMBHALA]:
                    new Shambhala(config.shambhala.client, { token: jwt })
                        .generateAddress,

            }, () => Promise.reject("unknown signing method"))


        // sets the "onboarding - last used" accountId in Keys redux namespace
        await dispatch(KeysActions.setState({ accountId }))

        return accountId
    }




/**
 * Generates a set of signing keys.
 *
 * @function generateSigningKeys
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

        // this redux key is not used and does not necessarily need to be
        // set but will leave now for debugging/testing and perhaps future use
        await dispatch(KeysActions.setState({ signingKeys }))

        return signingKeys
    }




/**
 *
 * @function generateSignedMultisigTx
 * @return {Function}
 */
export const generateSignedMultisigTx = () =>
    async (_dispatch, getState) => {

        let
            { jwt } = getState().Auth,
            { accountId } = getState().Keys,
            { networkPassphrase, sequence } = getState().StellarAccounts[accountId],

            tx = new Transaction(await new Shambhala(
                config.shambhala.client,
                { token: jwt }
            ).generateSignedKeyAssocTX(accountId, sequence, networkPassphrase))

        return tx
    }




/**
 *
 * @function generateMultisigTx
 * @return {Function}
 */
export const generateMultisigTx = () =>
    async (_dispatch, getState) => {

        let
            { jwt } = getState().Auth,
            { accountId } = getState().Keys,
            { networkPassphrase, sequence } = getState().StellarAccounts[accountId],

            tx = new Transaction(await new Shambhala(
                config.shambhala.client,
                { token: jwt }
            ).generateKeyAssocTX(accountId, sequence, networkPassphrase))

        return tx
    }
