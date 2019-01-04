import { action as AccountsActions } from "../redux/Accounts"
import { string } from "@xcmats/js-toolbox"
import { action as AwaiterActions } from "../redux/Awaiter"
import { action as SnackyActions } from "../redux/Snacky"




/**
 * Sets account name type for new account and shows the modal.
 * 
 * @function showCreateAccountModal
 * @param {String} accountType 
 * @returns {Function}
 */
export const showCreateAccountModal = (accountType) =>
    async (dispatch, _getState) => {
        await dispatch(AccountsActions.setState({ accountType }))
        await dispatch(AccountsActions.showCreateAccountModal())
    }


/**
 * Handles negative button click event.
 * 
 * @function handleNo
 * @returns {Function}
 */
export const handleNo = () =>
    async (dispatch, _getState) => {
        await dispatch(AccountsActions.hideCreateAccountModal())
        await dispatch(AccountsActions.setState({
            accountType: string.empty(),
            name: string.empty(),
        }))
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
            let
                // { uid } = getState().Auth,
                { accountType, name } = getState().Accounts
            await dispatch(AwaiterActions.showSpinner())
            await dispatch(AwaiterActions.setProgressMessage(
                `Creating ${accountType} account ...`
            ))
            // await update(`user/${uid}/stellarAccounts/${accountId}`, { name })
            await dispatch(AwaiterActions.hideSpinner())
            await dispatch(AwaiterActions.setProgressMessage(string.empty()))
            await dispatch(AccountsActions.hideCreateAccountModal())
            await dispatch(AccountsActions.setState({
                accountType: string.empty(),
                name: string.empty(),
            }))
            await dispatch(SnackyActions.setColor("success"))
            await dispatch(SnackyActions.setMessage(
                `Account '${name}' created.`
            ))
            await dispatch(SnackyActions.showSnacky())
        } catch (error) {
            await dispatch(AwaiterActions.hideSpinner())
            await dispatch(AwaiterActions.setProgressMessage(string.empty()))
            await dispatch(AccountsActions.hideCreateAccountModal())
            await dispatch(AccountsActions.setState({
                accountType: string.empty(),
                name: string.empty(),
            }))
            await dispatch(SnackyActions.setColor("error"))
            await dispatch(SnackyActions.setMessage(error.message))
            await dispatch(SnackyActions.showSnacky())
        }
    }
}
