/**
 * Fusion.
 *
 * Thunks.
 *
 * @module thunks
 * @license Apache-2.0
 */




import { action as AuthActions } from "../../redux/Auth"
import { action as SnackyActions } from "../../redux/Snacky"
import { storageRef } from "../../firebase"
import { string } from "@xcmats/js-toolbox"




/**
 * 
 * @param {Boolean} showing 
 */
export const toggleConfirmDialog = (showing) =>
    async (dispatch, _getState) => {
        await dispatch(await AuthActions.toggleConfirmDialog(showing))
    }




/**
 * ...
 */
export const clearAvatar = () =>
    async (dispatch, getState) => {
        
        // hide modal confirmation dialog first and unblock UI
        await dispatch(await toggleConfirmDialog(false))
        await dispatch(await SnackyActions.setColor("success"))
        await dispatch(await SnackyActions.setMessage(
            "Avatar scheduled for deletion."
        ))
        await dispatch(await SnackyActions.showSnacky())

        // attempt to delete user's avatar
        try {
            const  avatarRef = storageRef().child(
                `${getState().Auth.uid}/avatar.jpeg`
            )
            await avatarRef.delete()
            await dispatch(await AuthActions.updateUserProfile({
                photoUrl: string.empty(),
            }))
            await dispatch(await SnackyActions.setColor("success"))
            await dispatch(await SnackyActions.setMessage(
                "Avatar has been deleted."
            ))
            await dispatch(await SnackyActions.showSnacky())
        } catch (error) {
            await dispatch(await SnackyActions.setColor("error"))
            await dispatch(await SnackyActions.setMessage(error.message))
            await dispatch(await SnackyActions.showSnacky())
        }
    }
