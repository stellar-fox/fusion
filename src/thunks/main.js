/**
 * Fusion.
 *
 * Thunks.
 *
 * @module thunks
 * @license Apache-2.0
 */




import { action as AppActions } from "../redux/Fusion"
import { action as AuthActions } from "../redux/Auth"
import { action as AwaiterActions } from "../redux/Awaiter"
import { action as FusionActions } from "../redux/Fusion"
import { actions as ModalsActions } from "../redux/Modals"
import { action as UserLoginActions } from "../redux/UserLogin"
import { detectAccount } from "../actions/stellarAccount"
import { detectSigningMethod } from "../actions/signingMethods"
import {
    authenticate,
    reauthenticate,
    storageRef,
} from "../firebase"
import { string } from "@xcmats/js-toolbox"
import { approveAccountDeletion } from "../thunks/DeleteUserAccount"




/**
 * Set new screen dimensions when browser-resize event is detected.
 * 
 * @function setScreenDimensions
 * @returns {Function} thunk action
 */
export const setScreenDimensions = () =>
    async (dispatch, _getState) =>
        await dispatch( await FusionActions.setDimensions())




/**
 * Log-in the user via UI.
 * 
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
                statusMessage: "Authenticating ...",
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
            
            await dispatch(await UserLoginActions.setState({
                statusMessage: "Fetching user accounts ...",
            }))

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
 * When a sensitive action is performed then recent authentication with
 *   _Firebase_ is required.
 * 
 * @function reAuthenticate
 * @param {String} password
 * @returns {Function} thunk action 
 */
export const reAuthenticate = (password) =>
    async (dispatch, _getState) => {
        await dispatch(await ModalsActions.toggleError(string.empty()))
        await dispatch(await ModalsActions.toggleProgress(true))
        try {
            await reauthenticate(password)
            await dispatch(await approveAccountDeletion(true))
        } catch (error) {
            await dispatch(await ModalsActions.toggleError(
                error.message
            ))
        } finally {
            await dispatch(await ModalsActions.toggleProgress(false))
        }
    }




/**
 * Clears _Auth_ Redux key, hence, logging out the user.
 * 
 * @function logOut
 * @returns {Function} thunk action
 */
export const logOut = () =>
    async (dispatch, _getState) => {
        await dispatch(await AuthActions.resetState())
        await dispatch(await UserLoginActions.resetState())
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
            .getDownloadURL()
            .then((photoUrl) => {
                dispatch(AuthActions.setState({ photoUrl }))
            })
            .catch((_error) => { /* no-op */ })




// ...
export const setDataLoading = () =>
    async (dispatch, _getState) => {
        dispatch(AppActions.setState({ loading: true }))
        dispatch(setAwaiterLoading("Loading application data ..."))
    }




// ...
export const setDataLoaded = () =>
    async (dispatch, _getState) => {
        dispatch(AppActions.setState({ loading: false }))
        dispatch(AwaiterActions.resetState())
    }




// ...
export const setAwaiterLoading = (message) =>
    async (dispatch, _getState) => {
        dispatch(AwaiterActions.setLoading())
        dispatch(AwaiterActions.showSpinner())
        dispatch(AwaiterActions.setProgressMessage(message))
    }




// ...
export const clearAwaiter = () =>
    async (dispatch, _getState) => {
        dispatch(AwaiterActions.resetState())
    }
