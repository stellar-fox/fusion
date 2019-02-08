/**
 * Fusion.
 *
 * Represents an action set that manipulates _Redux_ state. The actions in this
 * module reflect user interaction with the front-end elements pertaining to
 * the hardware keyring device such as _Ledger Nano S_.
 *
 * @module actions-onboarding
 * @license Apache-2.0
 */




import { action as AccountsActions } from "../redux/Accounts"
import { action as LedgerHQActions } from "../redux/LedgerHQ"
import { string } from "@xcmats/js-toolbox"
import { signTransaction } from "../lib/logic/ledgerhq"




/**
 *  Sets _redux_ state signifying if a "default" account (0) should be used for
 *  path derivation.
 *  @function setUseDefaultAccount
 *  @return {Function}
 */
export const setUseDefaultAccount = (choice) =>
    async (dispatch, _getState) => {

        await dispatch(LedgerHQActions.setState({ useDefaultAccount: choice }))
        return choice
    }




/**
 * Sets _account_ part of a derivation path. Positive integers are only valid
 * as an input.
 *  @function setAccount
 *  @return {Function}
 */
export const setAccount = (account) =>
    async (dispatch, _getState) => {

        if (!account || account < 0) {
            await dispatch(LedgerHQActions.setState({
                account: null,
                error: true,
                errorMessage: "Invalid input. Integer numbers only.",
            }))
            await dispatch(AccountsActions.setState({
                error: true,
                errorMessage: "Invalid input. Integer numbers only.",
            }))
        } else {
            await dispatch(LedgerHQActions.setState({
                account,
                error: false,
                errorMessage: string.empty(),
            }))
            await dispatch(AccountsActions.setState({
                error: false,
                errorMessage: string.empty(),
            }))
        }

        return account
    }




/**
 * Sign transaction using LedgerHQ device.
 * @function signTxWithLedgerHQ
 * @param {Transaction} tx Transaction to be signed with the device.
 * @return {Function}
 */
export const signTxWithLedgerHQ = (tx) =>
    async (_dispatch, getState) => {
        try {
            let { accountId } = getState().Keys,
                { useDefaultAccount, account } = getState().LedgerHQ,
                signedTx = await signTransaction(
                    tx, accountId, useDefaultAccount ? "0" : account
                )
            return signedTx
        } catch (error) {
            throw new Error(error.message)
        }
    }
