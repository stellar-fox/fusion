import {
    createReducer,
    string,
} from "@xcmats/js-toolbox"
import {
    applyVerificationCode, authenticate, resetPassword, signout, signup,
    updateEmail, updateUserProfile, updatePassword, verifyEmail,
    verifyPasswordResetCode, write,
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
export const SEND_EMAIL_VERIFICATION = "@Auth/SEND_EMAIL_VERIFICATION"




// ...
export const action = {

    // ...
    login: (...args) =>
        async (dispatch, _getState) => {
            try {
                const auth = await authenticate(...args)
                dispatch(action.setState({
                    uid: auth.user.uid,
                    email: auth.user.email,
                    displayName: auth.user.displayName || string.empty(),
                    photoUrl: auth.user.photoURL || string.empty(),
                    emailVerified: auth.user.emailVerified,
                }))
            } catch (error) {
                return Promise.reject(error)
            }
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
            dispatch(action.sendEmailVerification())
            dispatch(action.setState({
                uid: auth.user.uid,
                email: auth.user.email,
                displayName: auth.user.displayName,
                photoUrl: auth.user.photoURL,
                emailVerified: auth.user.emailVerified,
            }))
        },


    // ...
    updateUserProfile: (...args) =>
        async (dispatch, _getState) => {
            await updateUserProfile(...args)
            dispatch(action.setState(...args))
        },


    // ...
    setState: (state) => ({
        type: SET_STATE,
        state,
    }),


    // ...
    sendEmailVerification: () => {
        verifyEmail()
        return {
            type: SEND_EMAIL_VERIFICATION,
        }
    },


    // ...
    sendPasswordReset: (email) =>
        async (_dispatch, _getState) => {
            await resetPassword(email)
        },


    // ...
    processEmailRecoveryLink: (qs) =>
        async (dispatch, _getState) => {
            try {
                dispatch(action.setState({
                    actionMessage: "Recovering email ...",
                }))
                await applyVerificationCode(qs.oobCode)
                dispatch(action.setState({
                    actionMessage: "Email recovered.",
                    emailRecoveryMessage: "If you didn’t ask to change your sign-in email, it’s possible someone is trying to access your account and you should change your password right away.",
                }))
            } catch (error) {
                dispatch(action.setState({
                    actionMessage: "Email recovery failed.",
                    emailRecoveryMessage: error.message,
                }))
            }
        },


    // ...
    processVerificationLink: (qs) =>
        async (dispatch, _getState) => {
            try {
                dispatch(action.setState({
                    actionMessage: "Veryfying email ...",
                }))
                await applyVerificationCode(qs.oobCode)
                dispatch(action.setState({
                    actionMessage: "Email verified.",
                    emailVerified: true,
                    emailVerificationMessage: string.empty(),
                }))
            } catch (error) {
                dispatch(action.setState({
                    actionMessage: "Email verification failed.",
                    emailVerified: false,
                    emailVerificationMessage: error.message,
                }))
            }

        },


    // ...
    processPasswordResetLink: (qs) =>
        async (dispatch, _getState) => {
            try {
                await verifyPasswordResetCode(qs.oobCode)
                dispatch(action.setState({
                    resetLinkValid: true,
                    resetLinkInvalid: false,
                    resetPasswordVerificationMessage: string.empty(),
                }))

            } catch (error) {
                dispatch(action.setState({
                    resetLinkValid: false,
                    resetLinkInvalid: true,
                    resetPasswordVerificationMessage: error.message,
                }))
            }
        },


    // ...
    updateEmail: (newEmail) =>
        async (dispatch, _getState) => {
            try {
                await updateEmail(newEmail)
                dispatch(action.setState({
                    email: newEmail,
                    emailVerified: false,
                }))
            } catch (error) {
                return Promise.reject(error)
            }
        },


    // ...
    updatePassword: (code, newPassword) =>
        async (dispatch, _getState) => {
            try {
                await updatePassword(code, newPassword)
                dispatch(action.setState({
                    resetLinkValid: true,
                }))

            } catch (error) {
                return Promise.reject(error)
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


    // ...
    [SEND_EMAIL_VERIFICATION]: (state) => ({
        ...state,
    }),

})
