/**
 * Fusion.
 *
 * Represents an action set that manipulates _Redux_ state. The actions in this
 * module reflect user interaction with the front-end elements.
 *
 * @module actions-createAccount
 * @license Apache-2.0
 */




import { string } from "@xcmats/js-toolbox"
import { action as AccountsActions } from "../redux/Accounts"
import { action as AwaiterActions } from "../redux/Awaiter"
import { action as LedgerHQActions } from "../redux/LedgerHQ"
import { action as SnackyActions } from "../redux/Snacky"
import {
    action as KeysActions,
    signingMethod as sm,
} from "../redux/Keys"
import { signup } from "../actions/recipes/signup"
import { updateAccountName } from "../lib/logic/stellarAccount"




/**
 * Increments active step for `Stepper` component.
 * @function incrementActiveStep
 * @returns {Function}
 */
export const incrementActiveStep = () =>
    async (dispatch, getState) => {
        let
            { activeStep, name } = getState().Accounts,
            { account } = getState().LedgerHQ,
            { accountId, signingMethod } = getState().Keys

        if (!name) {
            await dispatch(AccountsActions.setState({
                error: true,
                errorMessage: "Account name cannot be blank.",
            }))
            return
        }

        if (signingMethod === sm.LEDGERHQ && !account) {
            await dispatch(AccountsActions.setState({
                error: true,
                errorMessage: "Please provide a valid account.",
            }))
            return
        }

        if (signingMethod === sm.MANUAL && !accountId) {
            await dispatch(AccountsActions.setState({
                error: true,
                errorMessage: "Please provide a valid Account ID.",
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
 * Sets the user selected key manager type.
 * 
 * @function setKeyManager
 * @param {String} keyManager Specifies the type of key manager.
 * @returns {Function}
 */
export const setKeyManager = (keyManager) =>
    async (dispatch, _getState) => {
        await dispatch(AccountsActions.setState({
            keyManager,
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
        await dispatch(LedgerHQActions.resetState())
        await dispatch(KeysActions.resetState())
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
                { uid } = getState().Auth,
                { name } = getState().Accounts,
                { accountId, signingMethod } = getState().Keys

            await dispatch(signup(signingMethod))
            await updateAccountName(uid, accountId, name)
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
            await dispatch(AccountsActions.hideCreateAccountModal())
            await dispatch(AccountsActions.setState({
                accountType: string.empty(),
                activeStep: 0,
                name: string.empty(),
            }))
            await dispatch(SnackyActions.setColor("error"))
            await dispatch(SnackyActions.setMessage(error.message))
            await dispatch(SnackyActions.showSnacky())
        } finally {
            await dispatch(AwaiterActions.resetState())
            await dispatch(LedgerHQActions.resetState())
            await dispatch(KeysActions.resetState())
        }
    }
}
