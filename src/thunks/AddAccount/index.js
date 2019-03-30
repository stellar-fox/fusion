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
import { update } from "../../firebase"
import { config } from "../../config"
import {
    clearAwaiter,
    setAwaiterLoading,
} from "../main"
import { Networks } from "stellar-sdk"
import { AccountTypes } from "../../redux/Accounts"
import { signingMethod as sm } from "../../redux/Keys"




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
    async (_dispatch, getState) => {
        const
            {
                accountId,
                name,
                networkPassphrase,
                signingMethod,
            } = getState().AddAccount,

            { uid } = getState().Auth,

            {
                account,
                useDefaultAccount,
            } = getState().LedgerHQ


        await update(`user/${uid}/stellarAccounts/${accountId}`, {
            accountId,
            name,
            networkPassphrase,
            createdAt: Date.now(),
        })


        await update(
            `user/${uid}/signingMethods/${accountId}/${signingMethod}`, {
                createdAt: Date.now(),
            }
        )


        signingMethod === sm.LEDGERHQ &&
            await update(
                `user/${uid}/signingMethods/${accountId}/${signingMethod}`, {
                    account: useDefaultAccount ? "0" : account,
                }
            )
    }




/**
 * 
 */
export const generateAccountId = () =>
    async (dispatch, getState) => {

        
        const
            { accountType } = getState().AddAccount,
            { jwt } = getState().Auth
        
        // 0. Set Network passphrase based on accountType
        await dispatch(await AddAccountActions.setNetworkPassphrase(
            accountType === AccountTypes.REAL ? Networks.PUBLIC : Networks.TESTNET
        ))
                
        // 1. Instantiate Shambhala
        context.shambhala = await new Shambhala(
            config.shambhala.client,
            { token: jwt }
        )

        // 2. Obtain accountId from Shambhala
        const accountId = await context.shambhala.generateAddress()
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
        await dispatch(await setAwaiterLoading("Saving account data ..."))
        await dispatch(await saveAccountData())
        // 4. clear Redux child data by calling cancel action
        await dispatch(await cancel())
        // 5. close Shambhala pop-up
        await dispatch(await closeShambhalaPopup())
        // 6. clear awaiter
        await dispatch(await clearAwaiter())
    }
