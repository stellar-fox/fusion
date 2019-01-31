/**
 * Fusion.
 *
 * Thunks.
 *
 * @module thunks
 * @license Apache-2.0
 */


import { actions as AddAccountActions } from "../../redux/AddAccount"
import { string } from "@xcmats/js-toolbox"




/**
 * 
 * @param {String} accountType 
 */
export const addAccount = (accountType) =>
    async (dispatch, _getState) => {
        await dispatch(await AddAccountActions.setAccountType(accountType))
        await dispatch(await AddAccountActions.toggleDialog(true))
    }




/**
 * 
 * @param {String} accountName 
 */
export const setAccountName = (accountName) =>
    async (dispatch, getState) => {
        await dispatch(await AddAccountActions.setName(accountName))
        const { activeStep, name } = getState().AddAccount
        
        if (activeStep === 0 && name === string.empty()) {
            await dispatch(
                await AddAccountActions.toggleError("Name cannot be empty.")
            )
        } else {
            await dispatch(await AddAccountActions.toggleError(string.empty()))
        }
    }




/**
 * 
 */
export const incrementActiveStep = () =>
    async (dispatch, getState) => {
        const { activeStep } = getState().AddAccount
        await dispatch(await AddAccountActions.setActiveStep(activeStep + 1))
    }




/**
 * 
 */
export const cancel = () =>
    async (dispatch, _getState) =>
        await dispatch(await AddAccountActions.resetState())




/**
 * 
 */
export const next = () =>
    async (dispatch, getState) => {
        const { name } = getState().AddAccount

        if (!name) {
            await dispatch(
                await AddAccountActions.toggleError("Name cannot be empty.")
            )
            return
        }

        await dispatch(await incrementActiveStep())
    }
