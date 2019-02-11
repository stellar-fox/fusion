import React, { Component } from "react"
import { bindActionCreators, compose } from "redux"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import { withStyles } from "@material-ui/core/styles"
import logo from "../Fusion/static/logo.svg"
import {
    Grid,
    Fade,
    Paper,
    Typography,
} from "@material-ui/core"




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
            actionMessage, classes, emailVerificationMessage,
        }) =>
            <Grid
                className={classes.container}
                container
                direction={"column"}
                justify={"space-around"}
                alignItems={"center"}
                style={{ height: "100%" }}
            >
                <Grid item>
                    <Paper elevation={0} className={classes.loginPaper}>
                        <Fade in><div className="flex-box-col items-centered">
                            <img
                                className={classes.appLogo}
                                src={logo} alt="logo"
                            />
                            <Typography align="center" variant="subtitle1">
                                {actionMessage}
                            </Typography>
                            <Typography align="center" variant="body2">
                                {emailVerificationMessage}
                            </Typography>
                        </div></Fade>
                    </Paper>
                </Grid>
            </Grid>
        )(this.props)
    }
)
