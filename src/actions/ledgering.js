/**
 * Fusion.
 *
 * LedgerHQ-UI interaction logic.
 *
 * @module onboarding-actions
 * @license Apache-2.0
 */




import { action as LedgerHQActions } from "../redux/LedgerHQ"




/**
 *  ...
 *  @return {Function}
 */
export const setUseDefaultAccount = (choice) =>
    async (dispatch, _getState) => {

        await dispatch(LedgerHQActions.setState({ useDefaultAccount: choice }))
        choice && (await dispatch(LedgerHQActions.setState({ account: "0" })))
        return choice
    }




/**
 *  ...
 *  @return {Function}
 */
export const setAccount = (account) =>
    async (dispatch, _getState) => {

        await dispatch(LedgerHQActions.setState({ account }))
        return account
    }
