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
 * @return {Function}
 */
export const getAccountId = () =>
    async (dispatch, getState) => {
        let
            { signingMethod } = getState().Onboarding,

            accountId = await func.choose(signingMethod, {

                [sm.MANUAL]: () =>
                    Promise.reject("NOT IMPLEMENTED YET"),

                [sm.LEDGERHQ]: () =>
                    Promise.reject("NOT IMPLEMENTED YET"),

                [sm.SHAMBHALA]:
                    new Shambhala(
                        // this should come from some config
                        "https://secrets.localhost/shambhala/shambhala.html"
                        // ...
                        // jwt.token will come from redux state
                    ).generateAddress,

            }, () => Promise.reject("unknown signing method"))

        await dispatch(KeysActions.setState({ accountId }))

        return accountId
    }
