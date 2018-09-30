import React, { Component, Fragment } from "react"
import { bindActionCreators, compose } from "redux"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import {
    Button as GenericButton, Typography, withStyles,
} from "@material-ui/core"
import { VerifiedUserRounded } from "@material-ui/icons"
import TextInput from "../../lib/mui-v1/TextInput"
import withWidth, { isWidthDown } from "@material-ui/core/withWidth"
import { emptyString } from "@xcmats/js-toolbox"
import { htmlEntities as he } from "../../lib/utils"
import Button from "../../lib/mui-v1/Button"
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
        }),
        (dispatch) => bindActionCreators({
            sendEmailVerification: AuthActions.sendEmailVerification,
            sendPasswordReset: AuthActions.sendPasswordReset,
            openSnackbar: UserManagementActions.openSnackbar,
            setSnackbarMessage: UserManagementActions.setSnackbarMessage,
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
            emailVerified: false,
            name: emptyString(),
        }


        // ...
        componentDidMount = () => {
            this.setState({
                email: this.props.email,
                emailVerified: this.props.emailVerified,
            })
        }


        // ...
        setEmail = (e) => this.setState({
            email: e.target.value,
            emailVerified: e.target.value === this.props.email,
        })


        // ...
        setName = (e) => this.setState({
            name: e.target.value,
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
                            value={this.state.name}
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
                        Save
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
