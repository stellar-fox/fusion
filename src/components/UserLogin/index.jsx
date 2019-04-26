import React, { Component } from "react"
import PropTypes from "prop-types"
import { bindActionCreators, compose } from "redux"
import { connect } from "react-redux"
import { withStyles } from "@material-ui/core/styles"
import {
    LinearProgress,
    Typography,
} from "@material-ui/core"
import Button from "../../lib/mui-v1/Button"
import TextInput from "../../lib/mui-v1/TextInput"
import { env } from "../Fusion"
import logo from "../Fusion/static/logo.svg"
import {
    doAuthenticate,
    setDataLoaded,
} from "../../thunks/main"
import { action as UserLoginActions } from "../../redux/UserLogin"
import ReCaptchaV2 from "../ReCaptchaV2"



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
            reCaptchaVisible: state.Auth.reCaptchaVisible,
            reCaptchaToken: state.Auth.reCaptchaToken,
            userLogin: state.UserLogin,
        }),
        (dispatch) => bindActionCreators({
            doAuthenticate,
            setDataLoaded,
            setEmail: UserLoginActions.setEmail,
            setPassword: UserLoginActions.setPassword,
        }, dispatch)
    ),
)(
    class extends Component {


        // ...
        static propTypes = {
            classes: PropTypes.object.isRequired,
            doAuthenticate: PropTypes.func.isRequired,
            setEmail: PropTypes.func.isRequired,
            setPassword: PropTypes.func.isRequired,
        }


        // ...
        componentDidMount = () => setTimeout(this.props.setDataLoaded, 500)


        // ...
        render = () => (({
            doAuthenticate, classes, setEmail, reCaptchaToken, reCaptchaVisible,
            setPassword, userLogin,
        }) =>
            <div className={classes.root}>
                <img
                    className={classes.appLogo}
                    src={logo} alt="logo"
                />
                <Typography variant="h6">
                    {env.appVisName}
                </Typography>
                <Typography variant="subtitle1">
                    Sign-in and bank.
                </Typography>
                <TextInput
                    id="email"
                    label="Email"
                    type="text"
                    fullWidth
                    value={userLogin.email}
                    onChange={(e) => setEmail(e.target.value)}
                    autocomplete={false}
                    error={userLogin.errorEmail}
                    errorMessage={userLogin.errorMessageEmail}
                />
                <TextInput
                    id="password"
                    label="Password"
                    type="password"
                    fullWidth
                    value={userLogin.password}
                    onChange={(e) => setPassword(e.target.value)}
                    autocomplete={false}
                    error={userLogin.errorPassword}
                    errorMessage={userLogin.errorMessagePassword}
                />
                <Button
                    fullWidth
                    color="green"
                    disabled={
                        reCaptchaVisible && !reCaptchaToken ? true :
                            userLogin.disabled
                    }
                    onClick={() => doAuthenticate()}
                >
                    Sign In
                </Button>
                <LinearProgress
                    variant="indeterminate"
                    classes={{ root: this.props.classes.progressBar }}
                    style={{ opacity: userLogin.progressBarOpacity }}
                />
                <Typography
                    style={{
                        height: 11,
                        marginTop: "0.5rem",
                        opacity: userLogin.progressBarOpacity - 0.5,
                    }}
                    variant="caption"
                >
                    {userLogin.statusMessage}
                </Typography>

                {reCaptchaVisible && <ReCaptchaV2 />}

                {this.props.reCaptchaError &&
                    <Typography
                        style={{
                            height: 11,
                            marginTop: "0.5rem",
                            marginBottom: "1rem",
                            opacity: 0.5,
                        }}
                        variant="caption"
                    >
                        {this.props.reCaptchaError}
                    </Typography>
                }

            </div>
        )(this.props)
    }
)
