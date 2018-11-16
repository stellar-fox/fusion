/**
 * Fusion.
 *
 * Onboarding logic.
 *
 * @module onboarding-actions
 * @license Apache-2.0
 */




import {
    createReducer,
    func,
} from "@xcmats/js-toolbox"
import { Shambhala } from "../lib/shambhala.client"
import { signingMethod as sm } from "../logic/onboarding"




// Onboarding state
const initState = {
    signingMethod: null,
    accountId: null,
}




// ...
export const RESET_STATE = "@Onboarding/RESET_STATE"
export const SET_STATE = "@Onboarding/SET_STATE"




// ...
export const action = {


    // ...
    setSigningMethod: (signingMethod) =>
        async (dispatch, _getState) =>
            await dispatch(action.setState({ signingMethod })),


    // ...
    getAccountId: () =>
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
            await dispatch(action.setState({ accountId }))
            return accountId
        },


    // ...
    resetState: () => ({ type: RESET_STATE }),


    // ...
    setState: (state) => ({
        type: SET_STATE,
        state,
    }),

}




// ...
export const reducer = createReducer(initState)({

    // ...
    [RESET_STATE]: () => initState,


    // ...
    [SET_STATE]: (state, action) => ({
        ...state,
        ...action.state,
    }),

})
