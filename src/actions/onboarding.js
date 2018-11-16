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
import { Transaction } from "stellar-sdk"



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
                    new Shambhala(config.shambhala.client, jwt)
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
            signingKeys = await new Shambhala(config.shambhala.client, jwt)
                .generateSigningKeys(accountId)

        // TODO: remove later - leave now for debugging/testing
        await dispatch(KeysActions.setState({ signingKeys }))

        return signingKeys
    }



// 1. fund the account - only if there are not enough funds on the account
// that would prevent the further operations of injecting multisignatures.

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



// 2. call generateSignedKeyAssocTX

// 3. broadcast it to the network
