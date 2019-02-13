/**
 * Fusion.
 *
 * Thunks.
 *
 * @module thunks
 * @license Apache-2.0
 */




import { action as SnackyActions } from "../../redux/Snacky"
import {
    actions as ModalsActions,
    modalNames,
} from "../../redux/Modals"
import { firebaseSingleton } from "../../firebase"
import { clearAvatar } from "../ClearAvatar"




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
            await dispatch(await clearAvatar())
            await user.delete()
            await dispatch(await SnackyActions.setColor("success"))
            await dispatch(await SnackyActions.setMessage(
                "User account has been deleted."
            ))
            await dispatch(await SnackyActions.showSnacky())
        } catch (error) {
            if (error.code === "auth/requires-recent-login") {
                console.log("display re-authentication dialog")
                return
            }
            await dispatch(await SnackyActions.setColor("error"))
            await dispatch(await SnackyActions.setMessage(error.message))
            await dispatch(await SnackyActions.showSnacky())
        }
        
    }
