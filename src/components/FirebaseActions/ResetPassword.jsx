import React, { Component, Fragment } from "react"
import { bindActionCreators, compose } from "redux"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import { withStyles } from "@material-ui/core/styles"
import { fade } from "@material-ui/core/styles/colorManipulator"
import { Grid, Paper, Typography } from "@material-ui/core"
import UserPasswordUpdate from "../UserPasswordUpdate"




// <ResetPassword> component
export default compose(
    withStyles((theme) => ({

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
                backgroundColor: fade(theme.palette.custom.onyx, 0.3),
            },
            [theme.breakpoints.down("sm")]: {
                backgroundColor: "unset",
                boxShadow: "none",
            },
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
                    <Paper elevation={2} className={classes.loginPaper}>
                        {resetLinkValid &&
                            <UserPasswordUpdate oobCode={oobCode} continueUrl={continueUrl} />
                        }
                        {resetLinkInvalid &&
                            <Fragment>
                                <Typography align="center" variant="subtitle1">Try resetting your password again.</Typography>
                                <Typography align="center" variant="body2">Your request to reset your password has expired or the link has already been used.</Typography>
                            </Fragment>
                        }
                    </Paper>
                </Grid>
            </Grid>
        )(this.props)
    }
)
