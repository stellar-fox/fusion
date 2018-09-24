import React, { Component, Fragment } from "react"
import { bindActionCreators, compose } from "redux"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import { withStyles } from "@material-ui/core/styles"
import { url, rgba } from "../../lib/utils"
import logo from "../Fusion/static/logo.svg"
import background from "../Fusion/static/bg.png"
import { Grid, Paper, Typography, } from "@material-ui/core"




// <VerifyEmail> component
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
            [theme.breakpoints.up("md")]: {
                backgroundImage: url(background),
            },
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
                backgroundColor: rgba(29, 36, 46, 0.25),
            },
            backgroundColor: theme.palette.primary.light,
            margin: "0em 0.5em",
            padding: "0.5em",
        },
    })),

    connect(
        (state) => ({
            actionMessage: state.Auth.actionMessage,
            emailVerified: state.Auth.emailVerified,
            emailVerificationMessage: state.Auth.emailVerificationMessage,
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
        render = () => (({
            actionMessage, classes, continueUrl, emailVerificationMessage,
        }) =>
            <Grid
                className={classes.container}
                container
                direction={"column"}
                justify={"space-around"}
                alignItems={"center"}
                style={{ height: "100%", }}
            >
                <Grid item>
                    <img
                        className={classes.appLogo}
                        src={logo} alt="logo"
                    />
                </Grid>

                <Grid item>
                    <Paper elevation={2} className={classes.loginPaper}>
                        <Fragment>
                            <Typography align="center" variant="subheading">
                                {actionMessage}
                            </Typography>
                            <Typography align="center" variant="body2">
                                {emailVerificationMessage}
                            </Typography>
                            {continueUrl &&
                            <Fragment>
                                <br />
                                <Typography align="center" variant="caption">
                                    <a className={classes.link}
                                        href={`${continueUrl}`}
                                    >Continue</a> to your account.
                                </Typography>
                            </Fragment>
                            }
                        </Fragment>
                    </Paper>
                </Grid>
            </Grid>
        )(this.props)
    }
)
