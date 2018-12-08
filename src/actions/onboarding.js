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




import { codec, func } from "@xcmats/js-toolbox"
import { Shambhala } from "../lib/shambhala.client"
import { action as KeysActions, signingMethod as sm } from "../redux/Keys"
import { config } from "../firebase/config"
import { Network, Networks, Server, Transaction } from "stellar-sdk"
import { getAccountId, getSoftwareVersion } from "../lib/logic/ledgerhq"
import { action as LedgerHQActions } from "../redux/LedgerHQ"
import { update } from "../firebase"



/**
 * @private
 * @constant {Object} context Private "onboarding" memory space
 */
const context = {}




/**
 * Sets private memory variables.
 *
 * @private
 * @function setEnv
 */
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
 * @returns {Function}
 */
export const setSigningMethod = (signingMethod) =>
    async (dispatch, _getState) =>
        await dispatch(KeysActions.setState({ signingMethod }))




/**
 * Updates _redux_ state holding the current progress message during onboarding.
 *
 * @function setProgressMessage
 * @param {String} progressMessage Current progress message to be set.
 * @returns {Function}
 */
export const setProgressMessage = (progressMessage) =>
    async (dispatch, _getState) =>
        await dispatch(KeysActions.setState({ progressMessage }))




/**
 * Updates _redux_ state holding the possible error message during onboarding.
 *
 * @function setErrorMessage
 * @param {String} errorMessage Error message to be set.
 * @returns {Function}
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
 * @returns {Function}
 */
export const obtainAccountId = () =>
    async (dispatch, getState) => {

        let
            { signingMethod } = getState().Keys,
            { useDefaultAccount, account } = getState().LedgerHQ,
            { jwt } = getState().Auth,

            accountId = await func.choose(signingMethod, {

                [sm.MANUAL]: async () =>
                    new Shambhala(
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
 * @returns {Function}
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
 * @returns {Function}
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
 * @returns {Function}
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




/**
 * Sets needed transaction details in Redux tree to display in summary modal.
 *
 * @function setTransactionDetails
 * @param {Transaction} txObject _stellar_ `Transaction` object.
 * @returns {Function}
 */
export const setTransactionDetails = (txObject) =>
    async (dispatch, _getState) =>
        dispatch (KeysActions.setState({
            txHash: codec.bytesToHex(txObject.hash()),
            txSourceAccount: txObject.source,
            txSequenceNumber: txObject.sequence,
            txFee: txObject.fee,
            txOpsNum: txObject.operations.length,
            txSignature: codec.bytesToHex(txObject.signatures[0].signature()),
        }))



/**
 * Handle user cancel decision. Cancels any pending awaits with Shambhala.
 *
 * @function cancel
 * @returns {Function}
 */
export const cancelShambhala = () =>
    async (_dispatch, getState) => {
        let shambhala = new Shambhala(
            config.shambhala.client,
            { token: getState().Auth.jwt }
        )
        await shambhala.cancel()
    }




/**
 * Try to close Shambhala instance pop-up window/tab.
 * closes Shambhala pop-up window/tab.
 *
 * @function close
 * @returns {Function}
 */
export const closeShambhala = () =>
    async (_dispatch, getState) => {
        let shambhala = new Shambhala(
            config.shambhala.client,
            { token: getState().Auth.jwt }
        )
        await shambhala.close()
    }




/**
 * Save onboarded account id and signing method to _Firebase_ database.
 *
 * @function saveAccountData
 * @returns {Function}
 */
export const saveAccountData = () =>
    async (_dispatch, getState) => {
        let { accountId, networkPassphrase, signingMethod } = getState().Keys
        await update(`user/${getState().Auth.uid}/accounts`, {
            [accountId]: {
                id: accountId,
                networkPassphrase,
                signingMethods: [signingMethod],
            },
        })
    }



/**
 * Reset onboarding _Redux_ branch state.
 *
 * @function resetOnboardingState
 * @returns {Function}
 */
export const resetOnboardingState = () =>
    async (dispatch, _getState) =>
        await dispatch(KeysActions.resetState())
