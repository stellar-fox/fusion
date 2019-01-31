/**
 * Fusion.
 *
 * Thunks.
 *
 * @module thunks
 * @license Apache-2.0
 */


import { actions as AddAccountActions } from "../../redux/AddAccount"


export const addAccount = (accountType) =>
    async (dispatch, _getState) => {
        await dispatch(await AddAccountActions.setAccountType(accountType))
        await dispatch(await AddAccountActions.toggleDialog(true))
    }


export const setAccountName = (accountName) =>
    async (dispatch, _getState) =>
        await dispatch(await AddAccountActions.setName(accountName))



export const cancel = () =>
    async (dispatch, _getState) =>
        await dispatch(await AddAccountActions.resetState())
