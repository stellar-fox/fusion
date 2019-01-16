import { action as AppActions } from "../redux/Fusion"




export const setDataLoading = () =>
    async (dispatch, _getState) =>
        dispatch(AppActions.setState({ loading: true }))




export const setDataLoaded = () =>
    async (dispatch, _getState) =>
        dispatch(AppActions.setState({ loading: false }))
