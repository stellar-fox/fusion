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
import { setName } from "../../actions/createAccount"
import { Motion, presets, spring } from "react-motion"




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
    classes, error, errorMessage, setName,
}) => {

    return (
        <Motion defaultStyle={{ opacity: 0 }}
            style={{
                opacity: spring(1, presets.gentle),
            }}
        >
            {value =>
                <div style={{
                    opacity: value.opacity,
                }} className="flex-box-col"
                >
                    <Typography
                        style={{ marginBottom: "1rem" }}
                        variant="subtitle1"
                    >
                        Please select the name that will best identify your
                        new account. This name can be edited later at any time.
                    </Typography>
                    <TextInput
                        autoFocus
                        label="Account Name"
                        onChange={(e) => setName(e.target.value)}
                        error={error}
                        errorMessage={errorMessage}
                        errorClasses={classes.inputError}
                    />
                </div>}
        </Motion>
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
            error: state.Accounts.error,
            errorMessage: state.Accounts.errorMessage,
        }),
        (dispatch) => bindActionCreators({
            setName,
        }, dispatch),
    ),
)(Step0)
