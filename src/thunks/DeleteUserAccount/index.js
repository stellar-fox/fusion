/**
 * Fusion.
 *
 * Thunks.
 *
 * @module thunks
 * @license Apache-2.0
 */



// import {
//     async,
//     type,
// } from "@xcmats/js-toolbox"
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



/**
 * @private
 * @constant {Object} context Private memory space
 */
const context = {}



/**
 * 
 * @param {Boolean} showing 
 */
export const toggleModal = (showing) =>
    async (dispatch, _getState) => {
        await dispatch(await ModalsActions.toggleModal(
            modalNames.CONFIRM_DELETE_ACCOUNT,
            showing
        ))
    }




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
    async (dispatch, _getState) => {
        const user = firebaseSingleton.auth().currentUser

        // hide modal confirmation dialog first and unblock UI
        await dispatch(await toggleModal(false))
        await dispatch(await SnackyActions.setColor("success"))
        await dispatch(await SnackyActions.setMessage(
            "User account scheduled for deletion."
        ))
        await dispatch(await SnackyActions.showSnacky())

        // attempt to delete user's account.
        try {
            await dispatch(await deleteAvatarFromStorage())
            await user.delete()
            await dispatch(await SnackyActions.setColor("success"))
            await dispatch(await SnackyActions.setMessage(
                "User account has been deleted."
            ))
            await dispatch(await SnackyActions.showSnacky())
        } catch (error) {

            if (error.code === "auth/requires-recent-login") {
                await dispatch(await SemaphoreActions.toggleSemaphore(
                    semaphoreNames.PENDING_REAUTH, true
                ))
                // await async.repeat(async () => {
                //     console.log("łejtin")
                //     context.reAuthResult = async.createMutex()
                //     let reAuthResult = await context.reAuthResult.lock()

                    
                // }, () => getState().Semaphore.pendingReAuth)
                await dispatch(await toggleReAuthModal(true))
                return
            }
            await dispatch(await SnackyActions.setColor("error"))
            await dispatch(await SnackyActions.setMessage(error.message))
            await dispatch(await SnackyActions.showSnacky())
        }
        
    }


export const getReAuthResult = (signature) =>
    (_dispatch, _getState) => {
        if (context.reAuthResult) {
            context.reAuthResult.resolve(signature)
            delete context.signatureInput
        }
    }
