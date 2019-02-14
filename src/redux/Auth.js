import {
    createReducer,
    string,
} from "@xcmats/js-toolbox"
import {
    applyVerificationCode,
    resetPassword,
    signout,
    signup,
    updateEmail,
    updateUserProfile,
    updatePassword,
    verifyEmail,
    verifyPasswordResetCode,
    write,
} from "../firebase"
import { action as StellarAccountsActions } from "../redux/StellarAccounts"
import { action as SigningMethodsActions } from "../redux/SigningMethods"




// <Auth> state
const initState = {
    confirmDialogVisible: false,
    ready: true,
    reCaptchaAvailable: false,
    reCaptchaVisible: false,
}




// ...
export const RESET_STATE = "@Auth/RESET_STATE"
export const SET_STATE = "@Auth/SET_STATE"
export const SEND_EMAIL_VERIFICATION = "@Auth/SEND_EMAIL_VERIFICATION"
export const TOGGLE_CONFIRM_DIALOG = "@Auth/TOGGLE_CONFIRM_DIALOG"
export const TOGGLE_RECAPTCHA = "@Auth/TOGGLE_RECAPTCHA"




// ...
export const action = {

    // ...
    logout: () =>
        async (dispatch, _getState) => {
            await signout()
            dispatch(action.resetState())
            dispatch(StellarAccountsActions.resetState())
            dispatch(SigningMethodsActions.resetState())
        },


    // ...
    resetState: () => ({ type: RESET_STATE }),


    // ...
    signup: (...args) =>
        async (dispatch, _getState) => {
            const auth = await signup(...args)
            await write(`user/${auth.user.uid}`, { createdAt: Date.now() })
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
    toggleConfirmDialog: (showing) => ({
        type: TOGGLE_CONFIRM_DIALOG,
        showing,
    }),


    // ...
    toggleRecaptcha: (showing) => ({
        type: TOGGLE_RECAPTCHA,
        showing,
    }),
        

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
                    emailRecoveryMessage: string.empty(),
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
                    emailVerified: false,
                    emailVerificationMessage: string.empty(),
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


    // ...
    [TOGGLE_CONFIRM_DIALOG]: (state, action) => ({
        ...state,
        confirmDialogVisible: action.showing,
    }),


    // ...
    [TOGGLE_RECAPTCHA]: (state, action) => ({
        ...state,
        reCaptchaVisible: action.showing,
    }),

})
