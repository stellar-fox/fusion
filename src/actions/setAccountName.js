/**
 * Fusion.
 *
 * Action set servicing `ModalEditName`.
 *
 * @module actions
 * @license Apache-2.0
 */




import { update } from "../firebase"
import { action as AccountsActions } from "../redux/Accounts"
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
 * @param {String} uid _Firebase_ generated unique user id.
 * @returns {Function}
 */
export const handleYes = () =>
    async (dispatch, getState) => {
        let
            { uid } = getState().Auth,
            { accountId, name } = getState().Accounts

        await update(`user/${uid}/stellarAccounts/${accountId}`, { name })
        await dispatch(AccountsActions.hideEditNameModal())
        await dispatch(AccountsActions.setState({
            accountId: string.empty(),
            name: string.empty(),
        }))
    }




/**
 * Handles netative button click event.
 * 
 * @function handleNo
 * @param {String} uid _Firebase_ generated unique user id.
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
