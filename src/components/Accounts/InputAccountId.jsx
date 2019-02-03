import React from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import { withStyles } from "@material-ui/core/styles"
import { func } from "@xcmats/js-toolbox"
import {
    Fade,
    Typography,
    withMobileDialog
} from "@material-ui/core"
import TextInput from "../../lib/mui-v1/TextInput"
import { handleAccountIdInput } from "../../actions/recipes/signup"




/**
 * Fusion.
 *
 * Renders account id input when manual key management is selected.
 *
 * @module client-ui-components
 * @license Apache-2.0
 */




/**
 * `<InputAccountId>` component.
 *
 * @function InputAccountId
 * @returns {React.ReactElement}
 */
const InputAccountId = ({
    accountId, classes, error, errorMessage, handleAccountIdInput,
}) => <Fade in timeout={{ enter: 700, exit: 300 }}><div className="flex-box-col">
    <Typography style={{ marginTop: "1rem" }} variant="h4">
        This option will attach two additional signers to
        your bank account. When you provide signed transaction,
        it will be verified against multisignature set.
        Provide <span className="cursive">
        Account ID</span> where singers should be added.
    </Typography>
    <div className="m-t flex-box-row">
        <TextInput
            label="Stellar Account ID"
            defaultValue={accountId}
            onChange={(e) => handleAccountIdInput(e.target.value)}
            type="text"
            fullWidth
            error={error}
            errorMessage={errorMessage}
            errorClasses={ classes.inputError }
        />
    </div>
</div></Fade>




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
            accountId: state.Keys.accountId,
            error: state.Accounts.error,
            errorMessage: state.Accounts.errorMessage,
        }),
        (dispatch) => bindActionCreators({
            handleAccountIdInput,
        }, dispatch),
    ),
)(InputAccountId)
