import React, { Component } from "react"
import PropTypes from "prop-types"
import { bindActionCreators, compose } from "redux"
import { connect } from "react-redux"
import { string } from "@xcmats/js-toolbox"
import { action as AuthActions } from "../../redux/Auth"
import { withStyles } from "@material-ui/core/styles"
import { LinearProgress } from "@material-ui/core"
import Button from "../../lib/mui-v1/Button"
import TextInput from "../../lib/mui-v1/TextInput"
import Snacky from "../../lib/mui-v1/Snacky"
import { Typography } from "@material-ui/core"
import { env } from "../Fusion"
import logo from "../Fusion/static/logo.svg"
import { action as SnackyActions } from "../../redux/Snacky"
import ReCaptchaV2 from "../ReCaptchaV2"
import { toggleRecaptchaToken } from "../../thunks/main"



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
        (state) => ({
            reCaptchaError: state.Auth.reCaptchaError,
            reCaptchaToken: state.Auth.reCaptchaToken,
        }),
        (dispatch) => bindActionCreators({
            sendPasswordReset: AuthActions.sendPasswordReset,
            showSnacky: SnackyActions.showSnacky,
            setSnackyMessage: SnackyActions.setMessage,
            setSnackyColor: SnackyActions.setColor,
            toggleRecaptchaToken,
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
            email: string.empty(),
            errorEmail: false,
            errorMessageEmail: string.empty(),
            progressBarOpacity: 0,
            statusMessage: string.empty(),
        }


        // ...
        setEmail = (e) =>
            this.setState({
                email: e.target.value,
                errorEmail: false,
                errorMessageEmail: string.empty(),
            })


        // ...
        sendPasswordResetLink = async () => {

            this.setState({
                statusMessage: string.empty(),
            })

            if (!this.props.reCaptchaToken) {
                this.setState({
                    statusMessage: "Please verify with reCaptcha.",
                })
                return
            }

            try {
                await this.setState({
                    disabled: true,
                    errorEmail: false,
                    errorMessageEmail: string.empty(),
                    progressBarOpacity: 1,
                })
                await this.props.sendPasswordReset(this.state.email)
                await this.setState({
                    disabled: false,
                    progressBarOpacity: 0,
                })
                await this.props.setSnackyColor("success")
                await this.props.setSnackyMessage(
                    "Password reset link has been sent."
                )
                await this.props.showSnacky()
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
            ({ classes, reCaptchaError }) =>

                <div className={classes.root}>
                    <Snacky />
                    <img
                        className={classes.appLogo}
                        src={logo} alt="logo"
                    />
                    <Typography variant="h6">
                        {env.appVisName}
                    </Typography>
                    <Typography variant="subtitle1">
                        Request password reset link.
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

                    <ReCaptchaV2 onVerify={this.onCaptchaVerify} />

                    <Typography
                        style={{
                            height: 11,
                            marginTop: "0.5rem",
                            marginBottom: "1rem",
                            opacity: 0.5,
                        }}
                        variant="body2"
                    >
                        {reCaptchaError}
                        {this.state.statusMessage}
                    </Typography>

                    <Button
                        fullWidth
                        color="yellowDark"
                        disabled={this.state.disabled}
                        onClick={this.sendPasswordResetLink}
                    >
                        Request Link
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
                        style={{
                            opacity: this.state.progressBarOpacity,
                            marginBottom: "0.5rem",
                        }}
                    />

                </div>
        )(this.props)
    }
)
