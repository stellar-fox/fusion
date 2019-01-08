/**
 * Fusion.
 *
 * Represents an action set that manipulates _Redux_ state. The actions in this
 * module reflect user interaction with the front-end elements.
 *
 * @module actions-createAccount
 * @license Apache-2.0
 */




import { action as AccountsActions } from "../redux/Accounts"
import { string } from "@xcmats/js-toolbox"
import { action as AwaiterActions } from "../redux/Awaiter"
import { action as SnackyActions } from "../redux/Snacky"




/**
 * Increments active step for `Stepper` component.
 * @function incrementActiveStep
 * @returns {Function}
 */
export const incrementActiveStep = () =>
    async (dispatch, getState) => {
        let { activeStep, name } = getState().Accounts
        if (!name) {
            await dispatch(AccountsActions.setState({
                error: true,
                errorMessage: "Account name cannot be blank.",
            }))
            return
        }
        await dispatch(AccountsActions.setState({
            error: false,
            errorMessage: string.empty(),
            activeStep: activeStep + 1,
        }))
    }




/**
 * Sets the desired account name from the UI.
 * 
 * @function setName
 * @param {String} name 
 * @returns {Function}
 */
export const setName = (name) =>
    async (dispatch, _getState) => {
        await dispatch(AccountsActions.setName(name))
        await dispatch(AccountsActions.setState({
            error: false,
            errorMessage: string.empty(),
        }))
    }




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
            activeStep: 0,
            name: string.empty(),
            error: false,
            errorMessage: string.empty(),
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
                activeStep: 0,
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
                activeStep: 0,
                name: string.empty(),
            }))
            await dispatch(SnackyActions.setColor("error"))
            await dispatch(SnackyActions.setMessage(error.message))
            await dispatch(SnackyActions.showSnacky())
        }
    }
}
