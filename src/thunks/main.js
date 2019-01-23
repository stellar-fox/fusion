/**
 * Fusion.
 *
 * Thunks.
 *
 * @module client-ui-thunks
 * @license Apache-2.0
 */




import { action as AppActions } from "../redux/Fusion"
import { action as AuthActions } from "../redux/Auth"
import { action as AwaiterActions } from "../redux/Awaiter"
import { action as UserLoginActions } from "../redux/UserLogin"
import { detectAccount } from "../actions/stellarAccount"
import { detectSigningMethod } from "../actions/signingMethods"
import { authenticate, storageRef } from "../firebase"
import { string } from "@xcmats/js-toolbox"




/**
 * Log-in the user via UI.
 * @function doAuthenticate
 * @returns {Function} thunk action
 */
export const doAuthenticate = () =>
    async (dispatch, getState) => {
        try {
            const { email, password } = getState().UserLogin

            // reset user login UI state
            await dispatch( await UserLoginActions.setState({
                disabled: true,
                errorEmail: false,
                errorMessageEmail: string.empty(),
                errorPassword: false,
                errorMessagePassword: string.empty(),
                progressBarOpacity: 1,
            }))
            
            // Authenticate with Firebase
            const auth = await authenticate(email, password)
            const jwt = await auth.user.getIdToken()

            // Set Redux variables
            await dispatch( await AuthActions.setState({
                email: auth.user.email,
                displayName: auth.user.displayName || string.empty(),
                photoUrl: auth.user.photoURL || string.empty(),
                emailVerified: auth.user.emailVerified,
                jwt,
            }))
            
            // Fetch photo url once
            !auth.user.photoURL &&
                await dispatch( await getStorageAvatar(auth.user))
            
            // Load user stellar accounts
            await dispatch( await detectAccount(auth.user.uid))
            await dispatch( await detectSigningMethod(auth.user.uid))

            // Signaling UI ready is done within above actions as they use
            // Firebase's "on value" event listener.

        } catch (error) {

            await dispatch(UserLoginActions.setState({
                progressBarOpacity: 0,
                disabled: false,
            }))

            // handle error on UI based on error code
            if (error.code === "auth/invalid-email") {
                await dispatch(UserLoginActions.setState({
                    errorEmail: true,
                    errorMessageEmail: error.message,
                    errorPassword: false,
                    errorMessagePassword: string.empty(),
                }))
                return
            }

            if (error.code === "auth/wrong-password") {
                await dispatch(UserLoginActions.setState({
                    errorEmail: false,
                    errorMessagePassword: "Password is invalid.",
                    errorPassword: true,
                    errorMessageEmail: string.empty(),
                }))
                return
            }

            if (error.code === "auth/user-not-found") {
                await dispatch(UserLoginActions.setState({
                    errorEmail: true,
                    errorPassword: true,
                    errorMessageEmail: "Invalid credentials.",
                    errorMessagePassword: "Invalid credentials.",
                }))
                return
            }

            // in case of other error - display the code/message
            await dispatch(UserLoginActions.setState({
                errorEmail: true,
                errorPassword: true,
                errorMessageEmail: error.code,
                errorMessagePassword: error.message,
            }))
        }
    }




/**
 * Fetch user uploaded avatar URL from _Firebase Storage_.
 * 
 * @function getStorageAvatar
 * @param {Object} user 
 * @returns {Function} thunk action
 */
export const getStorageAvatar = (user) =>
    async (dispatch, _getState) =>
        storageRef().child(`${user.uid}/avatar.jpeg`)
            .getDownloadURL().then((photoUrl) => {
                dispatch(AuthActions.setState({ photoUrl }))
            })




export const setDataLoading = () =>
    async (dispatch, _getState) => {
        dispatch(AppActions.setState({ loading: true }))
        dispatch(setAwaiterLoading("Loading application data ..."))
    }




export const setDataLoaded = () =>
    async (dispatch, _getState) => {
        dispatch(AppActions.setState({ loading: false }))
        dispatch(AwaiterActions.resetState())
    }




export const setAwaiterLoading = (message) =>
    async (dispatch, _getState) => {
        dispatch(AwaiterActions.setLoading())
        dispatch(AwaiterActions.showSpinner())
        dispatch(AwaiterActions.setProgressMessage(message))
    }




export const clearAwaiter = () =>
    async (dispatch, _getState) => {
        dispatch(AwaiterActions.resetState())
    }
