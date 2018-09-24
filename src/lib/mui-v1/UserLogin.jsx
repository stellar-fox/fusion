import React, { Component } from "react"
import PropTypes from "prop-types"
import { bindActionCreators, compose } from "redux"
import { connect } from "react-redux"
import { emptyString } from "@xcmats/js-toolbox"
import { action as AuthActions } from "../../redux/Auth"
import { withStyles } from "@material-ui/core/styles"
import { LinearProgress } from "@material-ui/core"
import Button from "./Button"
import TextInput from "./TextInput"
import { Typography } from "@material-ui/core"
import { env } from "../../components/Fusion"
import logo from "../../components/Fusion/static/logo.svg"


// <UserLogin> component
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
            loginAttempts: state.Auth.status.loginAttempts,
            maxLoginAttempts: state.Auth.status.maxLoginAttempts,
        }),
        (dispatch) => bindActionCreators({
            login: AuthActions.login,
        }, dispatch)
    ),
)(
    class extends Component {

        // ...
        static propTypes = {
            classes: PropTypes.object.isRequired,
            login: PropTypes.func.isRequired,
        }


        // ...
        state = {
            disabled: false,
            email: emptyString(),
            password: emptyString(),
            progressBarOpacity: 0,
            errorMessageEmail: emptyString(),
            errorMessagePassword: emptyString(),
        }


        // ...
        setEmail = (e) =>
            this.setState({ email: e.target.value, })


        // ...
        setPassword = (e) =>
            this.setState({ password: e.target.value, })


        // ...
        authenticate = async (_e) => {
            try {
                this.setState({
                    disabled: true,
                    errorEmail: false,
                    errorMessageEmail: emptyString(),
                    errorPassword: false,
                    errorMessagePassword: emptyString(),
                    progressBarOpacity: 1,
                })
                await this.props.login(
                    this.state.email,
                    this.state.password
                )
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
                        errorPassword: false,
                        errorMessagePassword: emptyString(),
                    })
                    return
                }

                if (error.code === "auth/wrong-password") {
                    this.setState({
                        errorEmail: false,
                        errorMessagePassword: "Password is invalid.",
                        errorPassword: true,
                        errorMessageEmail: emptyString(),
                    })
                    return
                }

                if (error.code === "auth/user-not-found") {
                    this.setState({
                        errorEmail: true,
                        errorPassword: true,
                        errorMessageEmail: "Invalid credentials.",
                        errorMessagePassword: "Invalid credentials.",
                    })
                    return
                }

                // in case of other error - display the code/message
                this.setState({
                    errorEmail: true,
                    errorPassword: true,
                    errorMessageEmail: error.code,
                    errorMessagePassword: error.message,
                })

            }
        }


        // ...
        render = () => (
            ({ classes, }) =>
                <div className={classes.root}>
                    <img
                        className={classes.appLogo}
                        src={logo} alt="logo"
                    />
                    <Typography variant="title">
                        {env.appVisName}
                    </Typography>
                    <Typography variant="subheading">
                        Sign-in and bank.
                    </Typography>
                    <TextInput
                        id="email"
                        label="Email"
                        type="text"
                        fullWidth
                        value={this.state.email}
                        onChange={this.setEmail}
                        autocomplete={false}
                        error={this.state.errorEmail}
                        errorMessage={this.state.errorMessageEmail}
                    />
                    <TextInput
                        id="password"
                        label="Password"
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
                        onClick={this.authenticate}
                    >
                        Sign In
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
