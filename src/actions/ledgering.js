/**
 * Fusion.
 *
 * LedgerHQ-UI interaction logic.
 *
 * @module onboarding-actions
 * @license Apache-2.0
 */




import { action as LedgerHQActions } from "../redux/LedgerHQ"
import { action as KeysActions } from "../redux/Keys"
import { string } from "@xcmats/js-toolbox"
import {
    getAccountId, getSoftwareVersion
} from "../lib/logic/ledgerhq"



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




/**
 *  ...
 *  @return {Function}
 */
export const queryForSoftwareVersion = () =>
    async (dispatch, _getState) => {
        const softwareVersion = await getSoftwareVersion()

        await dispatch(LedgerHQActions.setState({ softwareVersion }))

        return softwareVersion
    }




/**
 *  ...
 *  @return {Function}
 */
export const getAccountIdFromDevice = () =>
    async (dispatch, getState) => {
        const { useDefaultAccount, account } = getState().LedgerHQ,
            accountId = await getAccountId(useDefaultAccount ? "0" : account)

        await dispatch(KeysActions.setState({ accountId }))

        return accountId
    }
