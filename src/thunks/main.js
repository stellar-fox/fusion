import { action as AppActions } from "../redux/Fusion"
import { action as AuthActions } from "../redux/Auth"
import { action as AwaiterActions } from "../redux/Awaiter"
import { action as UserLoginActions } from "../redux/UserLogin"
import { authenticate, storageRef } from "../firebase"
import { string } from "@xcmats/js-toolbox"




export const doAuthenticate = () =>
    async (dispatch, getState) => {
        try {
            console.log("Attempting to authenticate ...")
            const { email, password } = getState().UserLogin

            await dispatch(UserLoginActions.setState({
                disabled: true,
                errorEmail: false,
                errorMessageEmail: string.empty(),
                errorPassword: false,
                errorMessagePassword: string.empty(),
                progressBarOpacity: 1,
            }))
            
            const auth = await authenticate(email, password)
            const jwt = await auth.user.getIdToken()

            await dispatch(AuthActions.setState({
                uid: auth.user.uid,
                email: auth.user.email,
                displayName: auth.user.displayName || string.empty(),
                photoUrl: auth.user.photoURL || string.empty(),
                emailVerified: auth.user.emailVerified,
                jwt,
            }))

            console.log("Got user credentials.")
            
            !auth.user.photoURL &&
                await dispatch(getStorageAvatar(auth.user))
            
            console.log("Logged in.")
            await dispatch(UserLoginActions.resetState())

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
