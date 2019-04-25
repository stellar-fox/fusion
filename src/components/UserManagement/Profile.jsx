import React, { Component, Fragment } from "react"
import { bindActionCreators, compose } from "redux"
import { connect } from "react-redux"
import {
    Button as GenericButton,
    CircularProgress,
    DialogContent,
    DialogContentText,
    DialogTitle,
    InputAdornment,
    Typography,
    Tooltip,
    withStyles,
} from "@material-ui/core"
import { fade } from "@material-ui/core/styles/colorManipulator"
import {
    NotificationImportantRounded,
    VerifiedUserRounded,
} from "@material-ui/icons"
import TextInput from "../../lib/mui-v1/TextInput"
import withWidth, { isWidthDown } from "@material-ui/core/withWidth"
import { string } from "@xcmats/js-toolbox"
import { htmlEntities as he } from "../../lib/utils"
import Button from "../../lib/mui-v1/Button"
import ConfirmDialog from "../../lib/mui-v1/ConfirmDialog"
import { action as AuthActions } from "../../redux/Auth"
import { reauthenticate, verifyEmail } from "../../firebase"
import Gravatar from "../Gravatar"
import PhotoAvatar from "../PhotoAvatar"
import ImageCropper from "../ImageCropper"
import { action as SnackyActions } from "../../redux/Snacky"
import AnimatedValue from "../AnimatedValue"
import {
    getCountOfDemoAccounts,
    getCountOfRealAccounts,
} from "../../lib/logic/stellarAccount"
import {
    clearAvatar,
    toggleConfirmDialog,
} from "../../thunks/ClearAvatar"
import ModalDeleteAccount from "./ModalDeleteAccount"
import {
    actions as ModalsActions,
    modalNames,
} from "../../redux/Modals"
import ModalReauthenticate from "./ModalReauthenticate"





// <Profile> component
export default compose(
    withStyles((theme) => ({
        iconVerified: {
            color: fade(theme.palette.custom.green, 0.7),
            marginBottom: "0.5rem",
        },
        buttonDanger: {
            backgroundColor: fade(theme.palette.error.main, 0.4),
            "&:hover": {
                backgroundColor: fade(theme.palette.error.main, 0.6),
            },
        },
        iconNotVerified: {
            color: fade(theme.palette.error.main, 0.7),
            marginBottom: "0.5rem",
        },
        tooltip: {
            fontFamily: "'Roboto Condensed', sans-serif",
        },
    })),
    connect(
        (state) => ({
            confirmDialogVisible: state.Auth.confirmDialogVisible,
            email: state.Auth.email,
            emailVerified: state.Auth.emailVerified,
            uid: state.Auth.uid,
            displayName: state.Auth.displayName || string.empty(),
            photoUrl: state.Auth.photoUrl,
            countDemo: getCountOfDemoAccounts(state.StellarAccounts),
            countReal: getCountOfRealAccounts(state.StellarAccounts),
        }),
        (dispatch) => bindActionCreators({
            clearAvatar,
            sendEmailVerification: AuthActions.sendEmailVerification,
            sendPasswordReset: AuthActions.sendPasswordReset,
            showSnacky: SnackyActions.showSnacky,
            setSnackyMessage: SnackyActions.setMessage,
            setSnackyColor: SnackyActions.setColor,
            updateUserProfile: AuthActions.updateUserProfile,
            updateEmail: AuthActions.updateEmail,
            toggleConfirmDialog,
            toggleModal: ModalsActions.toggleModal,
        }, dispatch)
    ),
    withWidth(),
)(
    class extends Component {

        // ...
        state = {
            email: string.empty(),
            errorEmail: false,
            errorMessageEmail: string.empty(),
            emailChanged: false,
            emailVerified: false,
            displayName: string.empty(),
            nameChanged: false,
            disabled: true,
            dialogReAuthVisible: false,
            saveInProgress: false,
            password: string.empty(),
            errorPassword: false,
            errorMessagePassword: string.empty(),
            reauthInProgress: false,
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
        setPassword = (e) =>
            this.setState({ password: e.target.value })


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
                errorMessageEmail: string.empty(),
                errorPassword: false,
                errorMessagePassword: string.empty(),
            })

            if (this.state.emailChanged) {
                try {
                    await this.props.updateEmail(this.state.email)
                    await verifyEmail()
                } catch (error) {
                    if (error.code === "auth/requires-recent-login") {
                        await this.setState({
                            dialogReAuthVisible: true,
                            saveInProgress: false,
                        })
                        return
                    }

                    if (error.code === "auth/invalid-email") {
                        this.setState({
                            errorEmail: true,
                            errorMessageEmail: error.message,
                            saveInProgress: false,
                        })
                        return
                    }

                    if (error.code === "auth/email-already-in-use") {
                        this.setState({
                            errorEmail: true,
                            errorMessageEmail: error.message,
                            saveInProgress: false,
                        })
                        return
                    }

                    // handle other type of error
                    await this.props.setSnackyColor("error")
                    await this.props.setSnackyMessage(error.message)
                    await this.props.showSnacky()

                }
            }

            if (this.state.nameChanged) {
                try {
                    await this.setState({ disabled: true })
                    await this.props.updateUserProfile({
                        displayName: this.state.displayName,
                    })

                } catch (error) {
                    await this.props.setSnackyColor("error")
                    await this.props.setSnackyMessage(error.message)
                    await this.props.showSnacky()
                    return
                }
            }


            await this.setState({
                emailChanged: false,
                nameChanged: false,
                saveInProgress: false,
            })

            this.fieldSetChanged()

            await this.props.setSnackyColor("success")
            await this.props.setSnackyMessage("User data saved.")
            await this.props.showSnacky()

        }


        // ...
        cancelSave = async () => {
            await this.setState({
                displayName: this.props.displayName,
                nameChanged: false,
                email: this.props.email,
                errorEmail: false,
                errorMessageEmail: string.empty(),
                emailVerified: this.props.emailVerified,
                emailChanged: false,
            })
            this.fieldSetChanged()
        }


        // ...
        handleClearAvatar = () => {
            this.props.clearAvatar()
        }


        // ...
        handleHideDialog = () => {
            this.props.toggleConfirmDialog(false)
        }


        // ...
        handleShowConfirmDialog = () => {
            this.props.toggleConfirmDialog(true)
        }

        // ...
        handleDeleteAccount = () => {
            this.props.toggleModal(modalNames.CONFIRM_DELETE_ACCOUNT, true)
        }


        // ...
        reAuthenticate = async () => {
            try {
                await this.setState({ reauthInProgress: true })
                await reauthenticate(this.state.password)
                await this.saveData()
                await this.setState({
                    dialogReAuthVisible: false,
                })
            } catch (error) {
                if (error.code === "auth/wrong-password") {
                    await this.setState({
                        errorPassword: true,
                        errorMessagePassword: "Password is invalid.",
                    })
                }
                await this.setState({ reauthInProgress: false })
            }
        }


        // ...
        hideDialog = () => this.setState({
            dialogReAuthVisible: false,
            saveInProgress: false,
        })


        // ...
        sendPasswordResetLink = async () => {
            this.props.sendPasswordReset(this.props.email)
            await this.props.setSnackyColor("success")
            await this.props.setSnackyMessage("Password reset link sent.")
            await this.props.showSnacky()
        }


        // ...
        sendVerificationLink = async () => {
            this.props.sendEmailVerification()
            await this.props.setSnackyColor("success")
            await this.props.setSnackyMessage("Email verification link sent.")
            await this.props.showSnacky()
        }


        // ...
        render = () => (
            ({ classes, confirmDialogVisible, countDemo, countReal, email,
                photoUrl, uid, width }) => <Fragment>

                <ConfirmDialog
                    dialogVisible={this.state.dialogReAuthVisible}
                    onOk={this.reAuthenticate}
                    onCancel={this.hideDialog}
                    okButtonText="Authenticate"
                    inProgress={this.state.reauthInProgress}
                    fullScreen={isWidthDown("sm", width)}
                >
                    <DialogTitle id="responsive-dialog-title">
                        {"Recent Authentication Required"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText style={{ paddingBottom: "1em" }}>
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
                            onChange={this.setPassword}
                            error={this.state.errorPassword}
                            errorMessage={this.state.errorMessagePassword}
                        />
                    </DialogContent>
                </ConfirmDialog>


                <ConfirmDialog
                    dialogVisible={confirmDialogVisible}
                    onOk={this.handleClearAvatar}
                    onCancel={this.handleHideDialog}
                    okButtonText="OK"
                    fullScreen={isWidthDown("sm", width)}
                    inProgress={false}
                >
                    <DialogTitle id="responsive-dialog-title">
                        {"DELETING AVATAR"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText style={{ paddingBottom: "1em" }}>
                            You are about to delete your avatar. This action
                            cannot be undone.
                        </DialogContentText>
                    </DialogContent>
                </ConfirmDialog>

                <ModalReauthenticate />
                <ModalDeleteAccount />


                <div className={isWidthDown("sm", width) ?
                    "flex-box-col" : "flex-box-row space-around"}
                >
                    <div>

                        {/* <Typography variant="subtitle1">
                            Manage user profile data here.
                        </Typography> */}

                        <div className="flex-box-row items-centered m-t m-b">
                            {photoUrl ? <PhotoAvatar src={photoUrl} /> :
                                <Gravatar email={email} />}

                            <div className="flex-box-col m-l-small">
                                <Typography variant="subtitle1">
                                    User ID
                                </Typography>
                                <Typography variant="overline">
                                    {uid}
                                </Typography>
                            </div>

                        </div>

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
                                endAdornment={
                                    <InputAdornment position="end">
                                        {this.state.emailVerified ?
                                            <Tooltip
                                                classes={{ tooltip: classes.tooltip }}
                                                title="Email was verified."
                                            >
                                                <VerifiedUserRounded
                                                    classes={{
                                                        root: classes.iconVerified,
                                                    }}
                                                />
                                            </Tooltip> :
                                            <Tooltip
                                                classes={{ tooltip: classes.tooltip }}
                                                title="Please verify your email."
                                            >
                                                <NotificationImportantRounded
                                                    classes={{
                                                        root: classes.iconNotVerified,
                                                    }}
                                                />
                                            </Tooltip>
                                        }
                                    </InputAdornment>
                                }
                            />
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
                                color="secondary" thickness={4} size={20}
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
                        <Typography style={{ paddingBottom: "1em" }}
                            variant="subtitle1"
                        >
                            Verification link didn't arrive?
                        </Typography>
                        <GenericButton size="small" fullWidth
                            onClick={this.sendVerificationLink}
                            variant="outlined" color="secondary"
                        >Send Link Again</GenericButton>
                        <br /><br />
                        <Typography style={{ paddingBottom: "1em" }}
                            variant="subtitle1"
                        >
                            Forgot password?
                        </Typography>
                        <GenericButton style={{ marginBottom: "1em" }}
                            size="small" fullWidth
                            onClick={this.sendPasswordResetLink}
                            variant="outlined" color="secondary"
                        >Reset Password</GenericButton>
                    </div>
                    <div >
                        <div className="m-t-large">
                            <Typography style={{ paddingBottom: "1em" }}
                                variant="subtitle1"
                            >
                                Don't like Gravatar photo?
                            </Typography>
                            <ImageCropper />
                        </div>
                        {photoUrl &&
                            <div className="m-t">
                                <Typography style={{ paddingBottom: "1em" }}
                                    variant="subtitle1"
                                >
                                    Bored with your Avatar?
                                </Typography>
                                <GenericButton style={{ marginBottom: "1em" }}
                                    size="small"
                                    fullWidth
                                    onClick={this.handleShowConfirmDialog}
                                    variant="outlined" color="secondary"
                                >Delete Avatar</GenericButton>
                            </div>
                        }

                        <div className="m-t">
                            <Typography style={{ paddingBottom: "1em" }}
                                variant="subtitle1"
                            >
                                Wanna leave?
                            </Typography>
                            <GenericButton
                                classes={{ root: classes.buttonDanger }}
                                style={{
                                    marginBottom: "1em",
                                }}
                                size="small"
                                fullWidth
                                onClick={this.handleDeleteAccount}
                                variant="outlined" color="secondary"
                            >Delete Account</GenericButton>
                        </div>

                        <Typography style={{ marginTop: "1rem" }}
                            variant="subtitle1"
                        >
                            Bank Summary
                        </Typography>

                        <div className="m-t m-b flex-box-row">
                            <Typography className="p-r" variant="subtitle2">
                                Number of Real Accounts:
                            </Typography>
                            <AnimatedValue
                                valueToAnimate={countReal}
                                variant="subtitle2"
                            />
                        </div>
                        <div className="m-t m-b flex-box-row">
                            <Typography className="p-r" variant="subtitle2">
                                Number of Demo Accounts:
                            </Typography>
                            <AnimatedValue
                                valueToAnimate={countDemo}
                                variant="subtitle2"
                            />
                        </div>
                    </div>


                </div>
            </Fragment>
        )(this.props)

    }
)
