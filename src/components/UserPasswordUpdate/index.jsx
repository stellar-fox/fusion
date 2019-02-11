import React, { Component } from "react"
import PropTypes from "prop-types"
import { bindActionCreators, compose } from "redux"
import { connect } from "react-redux"
import { string } from "@xcmats/js-toolbox"
import { action as AuthActions } from "../../redux/Auth"
import { withStyles } from "@material-ui/core/styles"
import {
    Fade,
    LinearProgress,
    Typography,
} from "@material-ui/core"
import Button from "../../lib/mui-v1/Button"
import TextInput from "../../lib/mui-v1/TextInput"
import { env } from "../Fusion"
import logo from "../Fusion/static/logo.svg"




// <PasswordUpdate> component
export default compose(
    withStyles((theme) => ({

        appLogo: {
            ...theme.fusion.appLogo,
            [theme.breakpoints.up("md")]: {
                height: "60px",
                margin: "40px",
            },
            [theme.breakpoints.down("sm")]: {
                height: "40px",
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
            updatePassword: AuthActions.updatePassword,
        }, dispatch)
    ),
)(
    class extends Component {

        // ...
        static propTypes = {
            classes: PropTypes.object.isRequired,
        }


        // ...
        state = {
            errorPassword: false,
            errorMessagePassword: string.empty(),
            disabled: false,
            password: string.empty(),
            progressBarOpacity: 0,
            passwordUpdated: false,
        }


        // ...
        setPassword = (e) =>
            this.setState({ password: e.target.value })


        // ...
        resetPassword = async (_e) => {
            try {

                await this.setState({
                    disabled: true,
                    error: false,
                    errorMessage: string.empty(),
                    progressBarOpacity: 1,
                })

                await this.props.updatePassword(
                    this.props.oobCode, this.state.password
                )

                await this.setState({
                    progressBarOpacity: 0,
                    passwordUpdated: true,
                })


            } catch (error) {

                if (error.code === "auth/weak-password") {
                    this.setState({
                        errorMessagePassword: "Password is invalid.",
                    })
                } else {
                    this.setState({
                        errorMessagePassword: error.message,
                    })
                }

                this.setState({
                    errorPassword: true,
                    disabled: false,
                    progressBarOpacity: 0,
                })
            }
        }


        // ...
        render = () => (
            ({ classes }) =>

                <div className={classes.root}>

                    {this.state.passwordUpdated ? <Fade in>
                        <div className="flex-box-col items-centered">
                            <img
                                className={classes.appLogo}
                                src={logo} alt="logo"
                            />
                            <Typography variant="subtitle1">
                                Password has been updated.
                            </Typography>
                            <Typography variant="body2">
                                You can now sign in with new password.
                            </Typography>
                        </div></Fade> :
                        <Fade in><div className="flex-box-col items-centered">
                            <img
                                className={classes.appLogo}
                                src={logo} alt="logo"
                            />
                            <Typography variant="h6">
                                {env.appVisName}
                            </Typography>
                            <Typography variant="subtitle1">
                                Update your password.
                            </Typography>
                            <TextInput
                                id="password"
                                label="New Password"
                                type="password"
                                fullWidth
                                value={this.state.password}
                                onChange={this.setPassword}
                                autocomplete={false}
                                error={this.state.errorPassword}
                                errorMessage={this.state.errorMessagePassword}
                            />
                            <Button
                                fullWidth
                                color="green"
                                disabled={this.state.disabled}
                                onClick={this.resetPassword}
                            >
                                Save
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
                                style={{ opacity: this.state.progressBarOpacity }}
                            />
                        </div></Fade>
                    }
                </div>
        )(this.props)
    }
)
