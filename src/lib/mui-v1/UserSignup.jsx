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


// <UserSignup> component
export default compose(
    withStyles((_theme) => ({

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
            signup: AuthActions.signup,
        }, dispatch)
    ),
)(
    class extends Component {

        // ...
        static propTypes = {
            classes: PropTypes.object.isRequired,
            signup: PropTypes.func.isRequired,
        }


        // ...
        state = {
            disabled: false,
            email: emptyString(),
            password: emptyString(),
            passwordConf: emptyString(),
            progressBarOpacity: 0,
            errorEmail: false,
            errorPassword: false,
            errorPasswordConf: false,
            errorMessagePassword: emptyString(),
            errorMessagePasswordConf: emptyString(),
        }


        // ...
        setEmail = (e) =>
            this.setState({ email: e.target.value, })


        // ...
        setPassword = (e) =>
            this.setState({ password: e.target.value, })


        // ...
        setPasswordConf = (e) =>
            this.setState({ passwordConf: e.target.value, })


        // ...
        passwordsMatch = () => this.state.password === this.state.passwordConf


        // ...
        signup = async (_e) => {
            if(!this.passwordsMatch()) {
                this.setState({
                    errorPassword: true,
                    errorPasswordConf: true,
                    disabled: false,
                    errorMessagePassword: "Passwords do not match.",
                    errorMessagePasswordConf: "Passwords do not match.",
                    progressBarOpacity: 0,
                })
                return
            }

            try {
                this.setState({
                    disabled: true,
                    errorEmail: false,
                    errorPassword: false,
                    errorPasswordConf: false,
                    errorMessageEmail: emptyString(),
                    errorMessagePassword: emptyString(),
                    errorMessagePasswordConf: emptyString(),
                    progressBarOpacity: 1,
                })
                await this.props.signup(
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
                    <Typography variant="title">
                        {env.appVisName}
                    </Typography>
                    <Typography variant="subheading">
                        Sign-up and bank.
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
                    <TextInput
                        id="passwordconf"
                        label="Password Confirmation"
                        type="password"
                        fullWidth
                        value={this.state.passwordConf}
                        onChange={this.setPasswordConf}
                        autocomplete={false}
                        error={this.state.errorPasswordConf}
                        errorMessage={this.state.errorMessagePasswordConf}
                    />

                    <Button
                        fullWidth
                        color="yellowDark"
                        disabled={this.state.disabled}
                        onClick={this.signup}
                    >
                        Sign Up
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
