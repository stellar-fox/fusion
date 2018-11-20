/**
 * Fusion.
 *
 * LedgerHQ-UI interaction logic.
 *
 * @module onboarding-actions
 * @license Apache-2.0
 */




import { action as LedgerHQActions } from "../redux/LedgerHQ"
import { string } from "@xcmats/js-toolbox"




/**
 *  ...
 *  @return {Function}
 */
export const setUseDefaultAccount = (choice) =>
    async (dispatch, _getState) => {

        await dispatch(LedgerHQActions.setState({ useDefaultAccount: choice }))
        return choice
    }




/**
 *  ...
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
