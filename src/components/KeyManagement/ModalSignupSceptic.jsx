import React, { Component } from "react"
import { bindActionCreators, compose } from "redux"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import { withStyles } from "@material-ui/core/styles"
import {
    Dialog, DialogActions, DialogContent, DialogTitle, Typography,
    withMobileDialog
} from "@material-ui/core"
import Button from "../../lib/mui-v1/Button"
import TextInput from "../../lib/mui-v1/TextInput"
import {
    execute,
    handleAccountIdInput,
} from "../../actions/recipes/signupSceptic"
import { cancel } from "../../actions/onboarding"



// <ModalSignupSceptic> component
export default compose(
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
        paper: {
            backgroundColor: theme.palette.custom.purpleDark,
        },
    })),
    connect(
        (state) => ({
            error: !!state.Keys.errorMessage,
            errorMessage: state.Keys.errorMessage,
            noButtonDisabled: state.Keys.noButtonDisabled,
            open: state.Keys.ModalSignupSceptic.showing,
            yesButtonDisabled: state.Keys.yesButtonDisabled,
        }),
        (dispatch) => bindActionCreators({
            cancel,
            execute,
            handleAccountIdInput,
        }, dispatch)
    )
)(
    class extends Component {

        // ...
        static propTypes = {
            classes: PropTypes.object.isRequired,
        }


        // ...
        handleYes = () => this.props.execute()


        // ...
        handleNo = () => this.props.cancel()


        // ...
        handleChange = () =>
            (event) => this.props.handleAccountIdInput(event.target.value)


        // ...
        render = () => (
            ({ classes, error, errorMessage, fullScreen, open,
                noButtonDisabled, yesButtonDisabled }) =>
                <Dialog
                    fullScreen={fullScreen}
                    open={open}
                    aria-labelledby="responsive-dialog-title"
                    classes={{ paper: classes.paper }}
                >
                    <DialogTitle classes={{ root: classes.dialogTitle }}
                        id="responsive-dialog-title"
                    >
                        Shambhala Sceptic - Welcome!
                    </DialogTitle>
                    <DialogContent>
                        <Typography variant="subtitle1">
                            You are about to add two additional signers to
                            your bank. Provide <span className="cursive">
                            Account ID</span> where singers should be added.
                        </Typography>
                        <div className="m-t flex-box-row">
                            <TextInput
                                label="Stellar Account ID"
                                defaultValue={this.props.account}
                                onChange={this.handleChange()}
                                type="text"
                                fullWidth
                                error={error}
                                errorMessage={errorMessage}
                                errorClasses={ classes.inputError }
                            />
                        </div>

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleYes} color="green"
                            autoFocus disabled={yesButtonDisabled}
                        >
                            Proceed
                        </Button>
                        <Button style={{ margin: "0 3px 0 10px" }}
                            onClick={this.handleNo} color="yellow"
                            disabled={noButtonDisabled}
                        >
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
        )(this.props)

    }
)
