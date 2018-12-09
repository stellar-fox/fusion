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
import { getCountOfAccounts } from "../../lib/logic/stellarAccount"




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
            photoUrl: state.Auth.photoUrl,
            count: getCountOfAccounts(state.StellarAccounts),
        }),
        (dispatch) => bindActionCreators({
            sendEmailVerification: AuthActions.sendEmailVerification,
            sendPasswordReset: AuthActions.sendPasswordReset,
            showSnacky: SnackyActions.showSnacky,
            setSnackyMessage: SnackyActions.setMessage,
            setSnackyColor: SnackyActions.setColor,
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
            ({ classes, count, email, photoUrl, uid, width }) => <Fragment>
                <ConfirmDialog
                    dialogVisible={this.state.dialogReAuthVisible}
                    onOk={this.reAuthenticate}
                    onCancel={this.hideDialog}
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

                <div className={isWidthDown("sm", width) ?
                    "flex-box-col" : "flex-box-row space-around"}
                >
                    <div>
                        <Typography variant="subtitle1">
                            Manage user profile data here.
                        </Typography>

                        <div className="flex-box-row items-centered m-t m-b">
                            {photoUrl ? <PhotoAvatar src={photoUrl} /> :
                                <Gravatar email={email} />}

                            <div className="flex-box-col m-l-small">
                                <Typography variant="h4">
                                    USER ID
                                </Typography>
                                <Typography variant="h3">
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
                            />
                            {this.state.emailVerified &&
                            <Fragment>
                                <he.Nbsp />
                                <VerifiedUserRounded
                                    classes={{ root: classes.iconVerified }}
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
                        <Typography style={{ paddingBottom: "1em" }}
                            variant="h4"
                        >
                            Verification link didn't arrive?
                        </Typography>
                        <GenericButton size="small"
                            onClick={this.sendVerificationLink}
                            variant="outlined" color="secondary"
                        >Send Link Again</GenericButton>
                        <br /><br />
                        <Typography style={{ paddingBottom: "1em" }}
                            variant="h4"
                        >
                            Forgot password?
                        </Typography>
                        <GenericButton style={{ marginBottom: "1em" }}
                            size="small"
                            onClick={this.sendPasswordResetLink}
                            variant="outlined" color="secondary"
                        >Reset Password</GenericButton>
                    </div>
                    <div >
                        <Typography variant="subtitle1">
                            Bank Summary
                        </Typography>

                        <div className="m-t m-b flex-box-row">
                            <Typography className="p-r" variant="h4">
                                Number of Accounts:
                            </Typography>
                            <AnimatedValue
                                valueToAnimate={count}
                                variant="h4"
                            />
                        </div>


                        <div className="m-t-large">
                            <Typography style={{ paddingBottom: "1em" }}
                                variant="h4"
                            >
                                Don't like Gravatar photo?
                            </Typography>
                            <ImageCropper />
                        </div>


                    </div>
                </div>
            </Fragment>
        )(this.props)

    }
)
