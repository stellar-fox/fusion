import React, { Component } from "react"
import { bindActionCreators, compose } from "redux"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import { withStyles } from "@material-ui/core/styles"
import {
    Grid,
    Fade,
    Paper,
    Typography,
} from "@material-ui/core"
import logo from "../Fusion/static/logo.svg"
import UserPasswordUpdate from "../UserPasswordUpdate"




// <ResetPassword> component
export default compose(
    withStyles((theme) => ({
        appLogo: {
            ...theme.fusion.appLogo,
            [theme.breakpoints.up("md")]: {
                height: "60px",
                margin: "40px",
            },
            [theme.breakpoints.down("sm")]: {
                height: "40px",
                margin: "20px",
            },
        },

        container: {
            backgroundPosition: "center center",
            backgroundSize: "cover",
            height: "100%",
        },

        link: {
            textDecoration: "none",
            color: theme.palette.secondary.light,
        },

        loginPaper: {
            [theme.breakpoints.up("md")]: {
                padding: "1em",
            },
            backgroundColor: theme.palette.custom.darkGunmetal,
            margin: "0em 0.5em",
            padding: "0.5em",
        },

    })),

    connect(
        (state) => ({
            resetLinkValid: state.Auth.resetLinkValid,
            resetLinkInvalid: state.Auth.resetLinkInvalid,
        }),
        (dispatch) => bindActionCreators({}, dispatch)
    )
)(
    class extends Component {

        // ...
        static propTypes = {
            classes: PropTypes.object.isRequired,
        }

        // ...
        render = () => (({ classes, continueUrl, oobCode, resetLinkValid, resetLinkInvalid }) =>
            <Grid
                className={classes.container}
                container
                direction={"column"}
                justify={"space-around"}
                alignItems={"center"}
                wrap={"nowrap"}
            >
                <Grid item>
                    <Paper elevation={0} className={classes.loginPaper}>
                        {resetLinkValid &&
                            <UserPasswordUpdate oobCode={oobCode} continueUrl={continueUrl} />
                        }
                        {resetLinkInvalid && <Fade in>
                            <div className="flex-box-col items-centered">
                                <img
                                    className={classes.appLogo}
                                    src={logo} alt="logo"
                                />
                                <div>
                                    <Typography align="center" variant="subtitle1">
                                        Try resetting your password again.
                                    </Typography>
                                    <Typography align="center" variant="body2">
                                        Your request to reset your password has 
                                        expired or the link has already been used.
                                    </Typography>
                                </div>
                            </div>
                        </Fade>
                        }
                    </Paper>
                </Grid>
            </Grid>
        )(this.props)
    }
)
