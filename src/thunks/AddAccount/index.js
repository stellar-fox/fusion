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
        const
            { jwt } = getState().Auth,
            accountId = await new Shambhala(
                config.shambhala.client,
                { token: jwt }
            ).generateAddress()
        await dispatch(await AddAccountActions.setAccountId(accountId))
    }




/**
 * 
 */
export const runAddAccountRecipe = () =>
    async (dispatch, _getState) => {

        // 0. set awaiter
        await dispatch(await setAwaiterLoading("Generating account number ..."))
        // 1. generate new accountId using Shambhala
        await dispatch(await generateAccountId())
        // 2. clear awaiter
        await dispatch(await clearAwaiter())
    }
