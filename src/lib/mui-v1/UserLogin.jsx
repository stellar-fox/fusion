import React, { Component } from "react"
import PropTypes from "prop-types"
import {
    bindActionCreators,
    compose,
} from "redux"
import { connect } from "react-redux"
import {
    access,
    emptyString
} from "@xcmats/js-toolbox"

import { action as AuthActions } from "../../redux/Auth"

import { withStyles } from "@material-ui/core/styles"
import { LinearProgress } from "@material-ui/core"

import Button from "./Button"
import TextInput from "./TextInput"
import { Typography } from "@material-ui/core"
import { env } from "../../components/Fusion"




// <UserLogin> component
export default compose(
    withStyles((_theme) => ({

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
            loginAttempts: PropTypes.number.isRequired,
            maxLoginAttempts: PropTypes.number.isRequired,
        }


        // ...
        state = {
            disabled: false,
            username: emptyString(),
            password: emptyString(),
            progressBarOpacity: 0,
        }


        // ...
        setUsername = (e) =>
            this.setState({ username: e.target.value, })


        // ...
        setPassword = (e) =>
            this.setState({ password: e.target.value, })


        // ...
        authenticate = async (_e) => {
            try {
                this.setState({
                    disabled: true,
                    error: false,
                    errorMessage: emptyString(),
                    progressBarOpacity: 1,
                })
                await this.props.login(
                    this.state.username,
                    this.state.password
                )
            } catch (error) {
                let
                    errorMessage = emptyString(),
                    status = access(error, ["response", "status",])

                if (status === 401) {
                    errorMessage = "Possibly invalid credentials."
                } else if (status === 503) {
                    errorMessage =
                        "HERE LDAP Server is deaf " +
                        `(${error.response.retries} attempts made)`
                } else {
                    errorMessage = error.message
                }

                this.setState({
                    disabled: false,
                    error: true,
                    errorMessage,
                    progressBarOpacity: 0,
                })
            }
        }


        // ...
        render = () => (
            ({ classes, loginAttempts, maxLoginAttempts, }) =>
                <div className={classes.root}>
                    <Typography variant="title">
                        {env.appVisName}
                    </Typography>
                    <Typography variant="subheading">
                        Sign-in and bank.
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

                    <Button
                        fullWidth
                        color="green"
                        disabled={this.state.disabled}
                        onClick={this.authenticate}
                    >
                        <span style={{fontSize: "0.8rem",}}>
                            <b>Sign In</b>
                            {
                                loginAttempts > 0 ?
                                    <span>
                                        &nbsp;
                                        ({loginAttempts}/{maxLoginAttempts})
                                    </span> : emptyString()
                            }
                        </span>
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
                    <div className="m-t-large"></div>
                    <Button
                        fullWidth
                        color="yellowDark"
                        disabled={this.state.disabled}
                        onClick={this.authenticate}
                    >
                        Sign Up
                    </Button>
                </div>
        )(this.props)
    }
)
