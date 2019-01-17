import { action as AwaiterActions } from "../redux/Awaiter"
import { action as AppActions } from "../redux/Fusion"




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
