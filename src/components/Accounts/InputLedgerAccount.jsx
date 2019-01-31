import React from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import { withStyles } from "@material-ui/core/styles"
import { func, type } from "@xcmats/js-toolbox"
import {
    FormControlLabel,
    Switch,
    Typography,
    withMobileDialog
} from "@material-ui/core"
import TextInput from "../../lib/mui-v1/TextInput"
import {
    setAccount,
    setUseDefaultAccount,
} from "../../actions/ledgering"





/**
 * Fusion.
 *
 * Renders LedgerHQ account selection control.
 *
 * @module client-ui-components
 * @license Apache-2.0
 */




/**
 * `<InputLedgerAccount>` component.
 *
 * @function InputLedgerAccount
 * @returns {React.ReactElement}
 */
const InputLedgerAccount = ({
    account, classes, error, errorMessage, setAccount, setUseDefaultAccount,
    useDefaultAccount,
}) => {

    return <div className="flex-box-col">
        <Typography style={{ marginTop: "1rem" }} variant="h4">
            Associate your <span className="cursive">
            Ledger Nano S</span> device with your bank.
            Gives you convenience of signing transactions
            with a PIN with no physical device present.
        </Typography>
        <div className="m-t flex-box-row">
            <FormControlLabel control={
                <Switch
                    checked={type.toBool(useDefaultAccount)}
                    onChange={(e) => setUseDefaultAccount(
                        e.target.checked
                    )}
                />
            } label="Use Default Account"
            />
        </div>

        {!useDefaultAccount &&
            <div className="flex-box-row">
                <TextInput
                    label="Account"
                    defaultValue={account}
                    onChange={(e) => setAccount(e.target.value)}
                    type="number"
                    min="0"
                    error={error}
                    errorMessage={errorMessage}
                    errorClasses={classes.inputError}
                />
            </div>
        }
        
    </div>
}
    




// ...
export default func.compose(
    withMobileDialog(),
    withStyles((theme) => ({
        inputError: {
            "&:hover:before": {
                borderBottomColor: `${theme.palette.error.light} !important`,
                borderBottomWidth: "1px !important",
            },
            "&:before": {
                borderBottomColor:
                    `${theme.palette.error.light} !important`,
            },
            "&:after": {
                borderBottomColor:
                    `${theme.palette.error.light} !important`,
            },
        },
    })),
    connect(
        (state) => ({
            account: state.LedgerHQ.account,
            error: state.Accounts.error,
            errorMessage: state.Accounts.errorMessage,
            useDefaultAccount: state.LedgerHQ.useDefaultAccount,
        }),
        (dispatch) => bindActionCreators({
            setAccount,
            setUseDefaultAccount,
        }, dispatch),
    ),
)(InputLedgerAccount)
