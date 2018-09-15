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
    withStyles((theme) => ({
        avatar: {
            margin: "0rem 1rem",
            backgroundColor: theme.palette.background.default,
            boxShadow: "0px 0px 20px 2px #0ff",
        },

        avatarRoot: {
            borderRadius: "3px",
            opacity: "0.5",
        },

        root: {
            display: "flex",
            alignContent: "flex-start",
            alignItems: "center",
            flexDirection: "column",
        },

        header: {
            color: "white",
            textAlign: "center",
            fontSize: "1.2rem",
            marginBottom: "10px",
        },

        subHeader: {
            color: "white",
            textAlign: "center",
            fontSize: "1rem",
            marginBottom: "30px",
        },

        progressBar: {
            width: "300px",
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
            username: emptyString(),
            password: emptyString(),
            passwordConf: emptyString(),
            progressBarOpacity: 0,
        }


        // ...
        setUsername = (e) =>
            this.setState({ username: e.target.value, })


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
                    error: true,
                    disabled: false,
                    errorMessage: "Passwords do not match.",
                    progressBarOpacity: 0,
                })
                return
            }

            try {
                this.setState({
                    disabled: true,
                    error: false,
                    errorMessage: emptyString(),
                    progressBarOpacity: 1,
                })
                await this.props.signup(
                    this.state.username,
                    this.state.password
                )
            } catch (error) {
                this.setState({
                    disabled: false,
                    error: true,
                    errorMessage: error.message,
                    progressBarOpacity: 0,
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
                        id="username"
                        label="Email"
                        type="text"
                        fullWidth
                        value={this.state.username}
                        onChange={this.setUsername}
                        autocomplete={false}
                        error={this.state.error}
                        errorMessage={this.state.errorMessage}
                    />
                    <TextInput
                        id="password"
                        label="Password"
                        type="password"
                        fullWidth
                        value={this.state.password}
                        onChange={this.setPassword}
                        autocomplete={false}
                        error={this.state.error}
                        errorMessage={this.state.errorMessage}
                    />
                    <TextInput
                        id="passwordconf"
                        label="Password Confirmation"
                        type="password"
                        fullWidth
                        value={this.state.passwordConf}
                        onChange={this.setPasswordConf}
                        autocomplete={false}
                        error={this.state.error}
                        errorMessage={this.state.errorMessage}
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
