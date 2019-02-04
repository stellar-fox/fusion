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
import { Shambhala } from "../../lib/shambhala.client"
import { config } from "../../firebase/config"
import {
    clearAwaiter,
    setAwaiterLoading,
} from "../main"



// Private memory for the functions in this file.
const context = {
    shambhala: null,
}



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
 * @param {String} signingMethod 
 */
export const setSigningMethod = (signingMethod) =>
    async (dispatch, _getState) =>
        await dispatch(await AddAccountActions.setSigningMethod(signingMethod))




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




/**
 * 
 */
export const saveAccountData = () =>
    async (_dispatch, _getState) => {

    }




/**
 * 
 */
export const generateAccountId = () =>
    async (dispatch, getState) => {
        context.shambhala = await new Shambhala(
            config.shambhala.client,
            { token: jwt }
        )
        const
            { jwt } = getState().Auth,
            accountId = await context.shambhala.generateAddress()
        await dispatch(await AddAccountActions.setAccountId(accountId))
    }




/**
 * 
 */
export const closeShambhalaPopup = () =>
    async (_dispatch, _getState) => await context.shambhala.close()




/**
 * 
 */
export const runAddAccountRecipe = () =>
    async (dispatch, _getState) => {

        // 1. set awaiter
        await dispatch(await setAwaiterLoading("Generating account number ..."))
        // 2. generate new accountId using Shambhala
        await dispatch(await generateAccountId())
        // 3. save account data
        await dispatch(await saveAccountData())
        // 4. clear Redux child data by calling cancel action
        await dispatch(await cancel())
        // 5. close Shambhala pop-up
        await dispatch(await closeShambhalaPopup())
        // 6. clear awaiter
        await dispatch(await clearAwaiter())
    }
