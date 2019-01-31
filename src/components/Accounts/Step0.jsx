import React from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import { withStyles } from "@material-ui/core/styles"
import { func } from "@xcmats/js-toolbox"
import {
    Typography,
    withMobileDialog
} from "@material-ui/core"
import TextInput from "../../lib/mui-v1/TextInput"
import { setAccountName } from "../../thunks/AddAccount/"




/**
 * Fusion.
 *
 * Step 0 for creating new account.
 *
 * @module client-ui-components
 * @license Apache-2.0
 */




/**
 * `<Step0>` component.
 *
 * @function Step0
 * @returns {React.ReactElement}
 */
const Step0 = ({
    classes, error, errorMessage, setAccountName,
}) => {

    return (
        
        <div className="flex-box-col">
            <Typography
                style={{ marginBottom: "1rem" }}
                variant="body2"
            >
                Please select the name that will best identify your
                new account. You can always change this name later.
            </Typography>
            <TextInput
                autoFocus
                label="Account Name"
                onChange={(e) => setAccountName(e.target.value)}
                error={error}
                errorMessage={errorMessage}
                errorClasses={classes.inputError}
            />
        </div>
    )
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
            error: state.AddAccount.error,
            errorMessage: state.AddAccount.errorMessage,
        }),
        (dispatch) => bindActionCreators({
            setAccountName,
        }, dispatch),
    ),
)(Step0)
