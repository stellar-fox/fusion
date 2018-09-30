import React, { Component } from "react"
import PropTypes from "prop-types"
import { bindActionCreators, compose } from "redux"
import { connect } from "react-redux"
import { emptyString } from "@xcmats/js-toolbox"
import { action as AuthActions } from "../../redux/Auth"
import { withStyles } from "@material-ui/core/styles"
import { LinearProgress } from "@material-ui/core"
import Button from "../../lib/mui-v1/Button"
import TextInput from "../../lib/mui-v1/TextInput"
import { IconButton, Snackbar, Typography } from "@material-ui/core"
import { Close } from "@material-ui/icons"
import { env } from "../Fusion"
import logo from "../Fusion/static/logo.svg"




// <ResetRequest> component
export default compose(
    withStyles((theme) => ({

        appLogo: {
            ...theme.fusion.appLogo,
            [theme.breakpoints.up("md")]: {
                height: "100px",
                margin: "40px",
            },
            [theme.breakpoints.down("sm")]: {
                height: "80px",
                margin: "20px",
            },
        },

        root: {
            display: "flex",
            alignContent: "flex-start",
            alignItems: "center",
            flexDirection: "column",
        },

        progressBar: {
            width: "100%",
            height: "2px",
            borderRadius: "2px",
            marginTop: "2px",
        },

    })),
    connect(
        (_state) => ({
        }),
        (dispatch) => bindActionCreators({
            sendPasswordReset: AuthActions.sendPasswordReset,
        }, dispatch)
    ),
)(
    class extends Component {

        // ...
        static propTypes = {
            classes: PropTypes.object.isRequired,
            sendPasswordReset: PropTypes.func.isRequired,
        }


        // ...
        state = {
            open: false,
            disabled: false,
            email: emptyString(),
            errorEmail: false,
            errorMessageEmail: emptyString(),
            progressBarOpacity: 0,
            snackbarMessage: emptyString(),
        }


        // ...
        setEmail = (e) =>
            this.setState({ email: e.target.value, })


        // ...
        closeSnackbar = () => this.setState({ open: false, })


        // ...
        popupSnackbar = (snackbarMessage) => this.setState({
            open: true,
            snackbarMessage,
        })


        // ...
        sendPasswordResetLink = async () => {

            try {
                await this.setState({
                    disabled: true,
                    errorEmail: false,
                    errorEmailMessage: emptyString(),
                    progressBarOpacity: 1,
                })
                await this.props.sendPasswordReset(this.state.email)
                await this.setState({
                    disabled: false,
                    progressBarOpacity: 0,
                })
                this.popupSnackbar("Reset link sent.")
            } catch (error) {

                // reset button and progress bar
                this.setState({
                    progressBarOpacity: 0,
                    disabled: false,
                })

                // THE CHECKS BELOW NEED TO BE DONE ON THE BACKEND.

                // handle error on UI based on error code
                if (error.code === "auth/invalid-email") {
                    this.setState({
                        errorEmail: true,
                        errorMessageEmail: error.message,
                    })
                    return
                }

                if (error.code === "auth/user-not-found") {
                    this.setState({
                        errorEmail: true,
                        errorMessageEmail: "Invalid email.",
                    })
                    return
                }

                // in case of other error - display the code/message
                this.setState({
                    errorEmail: true,
                    errorMessageEmail: error.message,
                })

            }

        }


        // ...
        render = () => (
            ({ classes, }) =>

                <div className={classes.root}>

                    <Snackbar
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "left",
                        }}
                        open={this.state.open}
                        autoHideDuration={3000}
                        onClose={this.closeSnackbar}
                        ContentProps={{
                            "aria-describedby": "message-id",
                        }}
                        message={
                            <span id="message-id">
                                <Typography variant="body2" color="inherit">
                                    {this.state.snackbarMessage}
                                </Typography>
                            </span>
                        }
                        action={[
                            <IconButton
                                key="close"
                                aria-label="Close"
                                color="inherit"
                                className={classes.close}
                                onClick={this.closeSnackbar}
                            >
                                <Close />
                            </IconButton>,
                        ]}
                    />

                    <img
                        className={classes.appLogo}
                        src={logo} alt="logo"
                    />
                    <Typography variant="title">
                        {env.appVisName}
                    </Typography>
                    <Typography variant="subheading">
                        Request password reset.
                    </Typography>
                    <TextInput
                        id="username"
                        label="Email"
                        type="text"
                        fullWidth
                        value={this.state.email}
                        onChange={this.setEmail}
                        autocomplete={false}
                        error={this.state.errorEmail}
                        errorMessage={this.state.errorMessageEmail}
                    />
                    <Button
                        fullWidth
                        color="yellowDark"
                        disabled={this.state.disabled}
                        onClick={this.sendPasswordResetLink}
                    >
                        Request
                    </Button>
                    <LinearProgress
                        variant="indeterminate"
                        classes={{
                            root:
                                this.props.classes.progressBar,
                            colorPrimary:
                                this.props.classes.colorPrimary,
                            barColorPrimary:
                                this.props.classes.barColorPrimary,
                        }}
                        style={{ opacity: this.state.progressBarOpacity, }}
                    />

                </div>
        )(this.props)
    }
)
