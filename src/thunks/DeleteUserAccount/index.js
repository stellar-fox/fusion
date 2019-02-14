/**
 * Fusion.
 *
 * Thunks.
 *
 * @module thunks
 * @license Apache-2.0
 */



import {
    async,
    type,
} from "@xcmats/js-toolbox"
import { action as SnackyActions } from "../../redux/Snacky"
import {
    actions as ModalsActions,
    modalNames,
} from "../../redux/Modals"
import {
    actions as SemaphoreActions,
    semaphoreNames,
} from "../../redux/Semaphore"
import { firebaseSingleton } from "../../firebase"
import { deleteAvatarFromStorage } from "../ClearAvatar"
import { logOut } from "../main"




/**
 * @private
 * @constant {Object} context Private memory space
 */
const context = {}



/**
 * 
 * @param {Boolean} showing 
 */
export const toggleConfirmationModal = (showing) =>
    async (dispatch, _getState) => {
        await dispatch(await ModalsActions.toggleModal(
            modalNames.CONFIRM_DELETE_ACCOUNT,
            showing
        ))
    }




/**
 * 
 * @param {Boolean} progress 
 */
export const toggleConfirmationProgress = (progress) =>
    async (dispatch, _getState) =>
        await dispatch(await ModalsActions.toggleProgress(progress))




/**
 * 
 * @param {Boolean} showing 
 */
export const toggleReAuthModal = (showing) =>
    async (dispatch, _getState) => {
        await dispatch(await ModalsActions.toggleModal(
            modalNames.REAUTHENTICATE,
            showing
        ))
    }




/**
 * ...
 */
export const deleteUserAccount = () =>
    async (dispatch, getState) => {
        const user = firebaseSingleton.auth().currentUser

        await dispatch(await ModalsActions.toggleProgress(true))

        // attempt to delete user's account.
        try {
            await dispatch(await deleteAvatarFromStorage())
            await user.delete()
            await dispatch(await toggleConfirmationProgress(false))
            await dispatch(await toggleConfirmationModal(false))
            await dispatch(await logOut())
            await dispatch(await SnackyActions.setColor("success"))
            await dispatch(await SnackyActions.setMessage(
                "User account has been deleted."
            ))
            await dispatch(await SnackyActions.showSnacky())
        } catch (error) {

            if (error.code === "auth/requires-recent-login") {

                // close confirmation dialog modal and reset progress
                await dispatch(await toggleConfirmationModal(false))
                await dispatch(await toggleConfirmationProgress(false))

                // set semaphore to true
                await dispatch(await SemaphoreActions.toggleSemaphore(
                    semaphoreNames.PENDING_REAUTH, true
                ))

                await async.repeat(async () => {
                    
                    //display re-authentication modal
                    await dispatch(await ModalsActions.resetState())
                    await dispatch(await toggleReAuthModal(true))
                    
                    // wait for re-authentication success
                    context.reAuthResult = async.createMutex()
                    await context.reAuthResult.lock()

                    // release semaphore upon success
                    await dispatch(await SemaphoreActions.toggleSemaphore(
                        semaphoreNames.PENDING_REAUTH, false
                    ))

                }, () => getState().Semaphore.pendingReAuth)

                // successfully re-authenticated at this point - hide modal
                await dispatch(await toggleReAuthModal(false))

                await user.delete()
                await dispatch(await logOut())
                await dispatch(await SnackyActions.setColor("success"))
                await dispatch(await SnackyActions.setMessage(
                    "User account has been deleted."
                ))
                await dispatch(await SnackyActions.showSnacky())
                return
            }
            await dispatch(await SnackyActions.setColor("error"))
            await dispatch(await SnackyActions.setMessage(error.message))
            await dispatch(await SnackyActions.showSnacky())
        }
        
    }




/**
 * Passes the result of user interactino with the UI. It is called from some
 * other thunk upon success.
 * 
 * @function approveAccountDeletion
 * @param {Boolean} result 
 * @returns {Function} thunk action
 */
export const approveAccountDeletion = (result) =>
    (_dispatch, _getState) => {
        if (type.isObject(context.reAuthResult)) {
            context.reAuthResult.resolve(result)
            delete context.reAuthResult
        }
    }
