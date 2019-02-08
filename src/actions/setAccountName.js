/**
 * Fusion.
 *
 * Action set servicing `ModalEditName`.
 *
 * @module actions-accountName
 * @license Apache-2.0
 */



import { updateAccountName } from "../lib/logic/stellarAccount"
import { action as AccountsActions } from "../redux/Accounts"
import { action as AwaiterActions } from "../redux/Awaiter"
import { action as SnackyActions } from "../redux/Snacky"
import { string } from "@xcmats/js-toolbox"




/**
 * Sets account name for account identified by given `accountId` and shows
 *  the modal.
 * 
 * @function showEditNameModal
 * @param {String} accountId 
 * @returns {Function}
 */
export const showEditNameModal = (accountId) =>
    async (dispatch, _getState) => {
        await dispatch(AccountsActions.setState({ accountId }))
        await dispatch(AccountsActions.showEditNameModal())
    }




/**
 * Handles positive button click event.
 * 
 * @function handleYes
 * @returns {Function}
 */
export const handleYes = () => {
    return async (dispatch, getState) => {
        try {
            let { uid } = getState().Auth,
                { accountId, name } = getState().Accounts
            await dispatch(AwaiterActions.showSpinner())
            await dispatch(AwaiterActions.setProgressMessage("Updating ..."))
            await updateAccountName(uid, accountId, name)
            await dispatch(AccountsActions.hideEditNameModal())
            await dispatch(AccountsActions.setState({
                accountId: string.empty(),
                name: string.empty(),
            }))
            await dispatch(SnackyActions.setColor("success"))
            await dispatch(SnackyActions.setMessage("User data saved."))
            await dispatch(SnackyActions.showSnacky())
        } catch (error) {
            await dispatch(AccountsActions.hideEditNameModal())
            await dispatch(AccountsActions.setState({
                accountId: string.empty(),
                name: string.empty(),
            }))
            await dispatch(SnackyActions.setColor("error"))
            await dispatch(SnackyActions.setMessage(error.message))
            await dispatch(SnackyActions.showSnacky())
        } finally {
            await dispatch(AwaiterActions.resetState())
        }
    }
}




/**
 * Handles negative button click event.
 * 
 * @function handleNo
 * @returns {Function}
 */
export const handleNo = () =>
    async (dispatch, _getState) => {
        await dispatch(AccountsActions.hideEditNameModal())
        await dispatch(AccountsActions.setState({
            accountId: string.empty(),
            name: string.empty(),
        }))
    }
