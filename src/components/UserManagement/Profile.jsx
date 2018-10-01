import React, { Component, Fragment } from "react"
import { bindActionCreators, compose } from "redux"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import {
    Button as GenericButton, CircularProgress, DialogContent,
    DialogContentText, DialogTitle, Typography, withStyles,
} from "@material-ui/core"
import { VerifiedUserRounded } from "@material-ui/icons"
import TextInput from "../../lib/mui-v1/TextInput"
import withWidth, { isWidthDown } from "@material-ui/core/withWidth"
import { emptyString } from "@xcmats/js-toolbox"
import { htmlEntities as he } from "../../lib/utils"
import Button from "../../lib/mui-v1/Button"
import ConfirmDialog from "../../lib/mui-v1/ConfirmDialog"
import { action as AuthActions } from "../../redux/Auth"
import { action as UserManagementActions } from "../../redux/UserManagement"




// <Profile> component
export default compose(
    withStyles((theme) => ({
        iconVerified: {
            color: theme.palette.custom.green,
        },
        button: {
            margin: "1rem, 0",
        },
    })),
    connect(
        (state) => ({
            email: state.Auth.email,
            emailVerified: state.Auth.emailVerified,
            uid: state.Auth.uid,
            displayName: state.Auth.displayName,
        }),
        (dispatch) => bindActionCreators({
            sendEmailVerification: AuthActions.sendEmailVerification,
            sendPasswordReset: AuthActions.sendPasswordReset,
            openSnackbar: UserManagementActions.openSnackbar,
            setSnackbarMessage: UserManagementActions.setSnackbarMessage,
            updateUserProfile: AuthActions.updateUserProfile,
            updateEmail: AuthActions.updateEmail,
        }, dispatch)
    ),
    withWidth(),
)(
    class extends Component {

        // ...
        static propTypes = {
            classes: PropTypes.object.isRequired,
        }


        // ...
        state = {
            email: emptyString(),
            emailChanged: false,
            emailVerified: false,
            displayName: emptyString(),
            nameChanged: false,
            disabled: true,
            dialogReAuthVisible: true,
            saveInProgress: true,
        }


        // ...
        componentDidMount = () => {
            this.setState({
                email: this.props.email,
                emailVerified: this.props.emailVerified,
                displayName: this.props.displayName,
            })
        }


        // ...
        setEmail = async (e) => {
            await this.setState({
                email: e.target.value,
                emailVerified: this.props.emailVerified &&
                    e.target.value === this.props.email,
                emailChanged: e.target.value !== this.props.email,
            })
            this.fieldSetChanged()
        }


        // ...
        setName = async (e) => {
            await this.setState({
                displayName: e.target.value,
                nameChanged: e.target.value !== this.props.displayName,
            })
            this.fieldSetChanged()
        }


        // ...
        fieldSetChanged = () => {
            this.setState({
                disabled: !(this.state.emailChanged || this.state.nameChanged),
            })
        }


        // ...
        saveData = async () => {

            await this.setState({
                saveInProgress: true,
                errorEmail: false,
                errorEmailMessage: emptyString(),
            })

            if (this.state.emailChanged) {
                try {
                    await this.props.updateEmail(this.state.email)
                } catch (error) {
                    if (error.code === "auth/requires-recent-login") {
                        this.setState({ dialogReAuthVisible: true, })
                        return
                    }

                    if (error.code === "auth/invalid-email") {
                        this.setState({
                            errorEmail: true,
                            errorEmailMessage: error.message,
                        })
                        return
                    }

                    if (error.code === "auth/email-already-in-use") {
                        this.setState({
                            errorEmail: true,
                            errorEmailMessage: error.message,
                        })
                        return
                    }

                    // handle other type of error
                    await this.props.setSnackbarMessage(error.message)
                    await this.props.openSnackbar()

                }
            }

            if (this.state.nameChanged) {
                try {
                    await this.setState({
                        disabled: true,
                    })

                    await this.props.updateUserProfile({
                        displayName: this.state.displayName,
                    })

                    await this.props.setSnackbarMessage(
                        "User data saved."
                    )

                    await this.props.openSnackbar()

                } catch (error) {
                    await this.props.setSnackbarMessage(
                        error.message
                    )
                    await this.props.openSnackbar()
                }
            }

            await this.setState({ saveInProgress: false, })

        }


        // ...
        cancelSave = async () => {
            await this.setState({
                displayName: this.props.displayName,
                nameChanged: false,
                email: this.props.email,
                emailVerified: this.props.emailVerified,
                emailChanged: false,
            })
            this.fieldSetChanged()
        }


        // ...
        reAuthenticate = async () => {
            await this.setState({
                dialogReAuthVisible: false,
            })
            console.log("Re Authenticate.")
            this.saveData()
        }


        // ...
        hideDialog = () => this.setState({
            dialogReAuthVisible: false,
            saveInProgress: false,
        })


        // ...
        sendPasswordResetLink = async () => {
            // this.props.sendPasswordReset()
            await this.props.setSnackbarMessage(
                "Password reset link sent."
            )
            await this.props.openSnackbar()
        }


        // ...
        sendVerificationLink = async () => {
            // this.props.sendEmailVerification()
            await this.props.setSnackbarMessage(
                "Email verification link sent."
            )
            await this.props.openSnackbar()
        }


        // ...
        render = () => (
            ({ classes, width, uid, }) =>
                <Fragment>

                    <ConfirmDialog dialogVisible={this.state.dialogReAuthVisible}
                        onOk={this.reAuthenticate}
                        onCancel={this.hideDialog}
                    >
                        <DialogTitle id="responsive-dialog-title">
                            {"Recent Authentication Required"}
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText style={{ paddingBottom: "1em", }}>
                                This operation is sensitive and requires your
                                password confirmation.
                            </DialogContentText>
                            <TextInput
                                id="password"
                                label="Password"
                                type="password"
                                fullWidth
                                lighter
                                autocomplete={false}
                                error={this.state.errorPassword}
                                errorMessage={this.state.errorMessagePassword}
                            />
                        </DialogContent>
                    </ConfirmDialog>

                    <Typography variant="subheading">
                        Manage user profile data here.
                    </Typography>
                    <Typography variant="display2">
                        User ID: {uid}
                    </Typography>

                    <div className="flex-box-row items-centered">
                        <TextInput
                            id="email"
                            label="Email"
                            type="text"
                            lighter
                            fullWidth={isWidthDown("sm", width)}
                            value={this.state.email}
                            onChange={this.setEmail}
                            autocomplete={false}
                            error={this.state.errorEmail}
                            errorMessage={this.state.errorMessageEmail}
                        />
                        {this.state.emailVerified &&
                        <Fragment>
                            <he.Nbsp />
                            <VerifiedUserRounded
                                classes={{ root: classes.iconVerified, }}
                            />
                        </Fragment>
                        }
                    </div>
                    <div className="flex-box-row">
                        <TextInput
                            id="name"
                            label="Name"
                            type="text"
                            lighter
                            fullWidth={isWidthDown("sm", width)}
                            value={this.state.displayName}
                            onChange={this.setName}
                            autocomplete={false}
                            error={this.state.errorName}
                            errorMessage={this.state.errorMessageName}
                        />
                    </div>

                    <Button
                        color="green"
                        disabled={this.state.disabled}
                        onClick={this.saveData}
                    >
                        {this.state.saveInProgress ? <CircularProgress
                            color="secondary" thickness={4} size={16}
                        /> : "Save"}
                    </Button>
                    <he.Nbsp /><he.Nbsp />
                    <Button
                        color="yellowDark"
                        disabled={this.state.disabled}
                        onClick={this.cancelSave}
                    >
                        Cancel
                    </Button>
                    <br /><br />
                    <Typography style={{ paddingBottom: "1em", }}
                        variant="display1"
                    >
                        Verification link didn't arrive?
                    </Typography>
                    <GenericButton size="small"
                        onClick={this.sendVerificationLink}
                        variant="outlined" color="secondary"
                    >Send Link Again</GenericButton>
                    <br /><br />
                    <Typography style={{ paddingBottom: "1em", }}
                        variant="display1"
                    >
                        Forgot password?
                    </Typography>
                    <GenericButton size="small"
                        onClick={this.sendPasswordResetLink}
                        variant="outlined" color="secondary"
                    >Reset Password</GenericButton>

                </Fragment>
        )(this.props)

    }
)
