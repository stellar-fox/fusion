import { createReducer } from "@xcmats/js-toolbox"
import {
    applyVerificationCode, authenticate, signout, signup, verifyEmail, write,
} from "../firebase"




// <Auth> state
const initState = {
    status: {
        loginAttempts: 0,
        maxLoginAttempts: 1,
    },
}




// ...
export const RESET_STATE = "@Auth/RESET_STATE"
export const SET_STATE = "@Auth/SET_STATE"




// ...
export const action = {

    // ...
    login: (...args) =>
        async (dispatch, _getState) => {
            const auth = await authenticate(...args)
            dispatch(action.setState({
                uid: auth.user.uid,
                email: auth.user.email,
                name: auth.user.displayName,
                photoUrl: auth.user.photoURL,
                emailVerified: auth.user.emailVerified,
            }))
        },


    // ...
    logout: () =>
        async (dispatch, _getState) => {
            await signout()
            dispatch(action.resetState())
        },


    // ...
    resetState: () => ({ type: RESET_STATE, }),


    // ...
    signup: (...args) =>
        async (dispatch, _getState) => {
            const auth = await signup(...args)
            await write(auth.user.uid, { foo: "bar", })
            await verifyEmail()
            dispatch(action.setState({
                uid: auth.user.uid,
                email: auth.user.email,
                name: auth.user.displayName,
                photoUrl: auth.user.photoURL,
                emailVerified: auth.user.emailVerified,
            }))
        },

    // ...
    setState: (state) => ({
        type: SET_STATE,
        state,
    }),


    // ...
    processVerificationLink: (...args) =>
        async (dispatch, _getState) => {
            try {
                dispatch(action.setState({
                    actionMessage: "Veryfying email ...",
                }))
                const verification = await applyVerificationCode(...args)
                dispatch(action.setState({
                    actionMessage: "Email verified.",
                    emailVerified: true,
                    emailVerificationMessage: verification,
                }))
            } catch (error) {
                dispatch(action.setState({
                    actionMessage: "Email verification failed.",
                    emailVerified: false,
                    emailVerificationMessage: error.message,
                }))
            }

        },
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
