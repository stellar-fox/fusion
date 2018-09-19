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
import { IconButton, Snackbar, Typography } from "@material-ui/core"
import { Close } from "@material-ui/icons"
import { env } from "../../components/Fusion"


// <ResetRequest> component
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
            username: emptyString(),
            message: emptyString(),
            progressBarOpacity: 0,
        }


        // ...
        setUsername = (e) =>
            this.setState({ username: e.target.value, })


        // ...
        closeSnackbar = () => this.setState({ open: false, })


        // ...
        popupSnackbar = (message) => this.setState({
            open: true,
            message,
        })


        // ...
        sendPasswordResetLink = async () => {

            try {
                await this.setState({
                    disabled: true,
                    error: false,
                    errorMessage: emptyString(),
                    progressBarOpacity: 1,
                })
                await this.props.sendPasswordReset(this.state.username)
                await this.setState({
                    disabled: false,
                    error: false,
                    errorMessage: emptyString(),
                    progressBarOpacity: 0,
                })
            } catch (error) {
                this.setState({
                    disabled: false,
                    // error: true,
                    // errorMessage: error.message,
                    progressBarOpacity: 0,
                })
            } finally {
                this.popupSnackbar("Reset link was sent out.")
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
                                    {this.state.message}
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
                        value={this.state.username}
                        onChange={this.setUsername}
                        autocomplete={false}
                        error={this.state.error}
                        errorMessage={this.state.errorMessage}
                    />
                    <Button
                        fullWidth
                        color="yellow"
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
