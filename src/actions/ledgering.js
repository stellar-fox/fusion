/**
 * Fusion.
 *
 * Represents an action set that manipulates _Redux_ state. The actions in this
 * module reflect user interaction with the front-end elements pertaining to
 * the hardware keyring device such as _Ledger Nano S_.
 *
 * @module ledgerhq-actions
 * @license Apache-2.0
 */




import { action as LedgerHQActions } from "../redux/LedgerHQ"
import { string } from "@xcmats/js-toolbox"




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
        } else {
            await dispatch(LedgerHQActions.setState({
                account,
                error: false,
                errorMessage: string.empty(),
            }))
        }

        return account
    }
