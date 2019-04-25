import React, { Fragment } from "react"
import {
    compose,
    bindActionCreators,
} from "redux"
import { connect } from "react-redux"
import { withStyles } from "@material-ui/core/styles"
import {
    Button,
    Fade,
    Grid,
    Hidden,
    Paper,
    Typography,
} from "@material-ui/core"
import ResetRequest from "../ResetRequest"
import { Link } from "react-router-dom"
import { fade } from "@material-ui/core/styles/colorManipulator"
import Loader from "../Loader"




// <PasswordReset> component
export default compose(
    withStyles((theme) => ({

        container: {
            backgroundPosition: "center center",
            backgroundSize: "cover",
            height: "100%",
        },

        loginPaper: {
            width: "460px",
            padding: "40px 80px 40px 80px",
            backgroundColor: fade(theme.palette.custom.onyx, 0.3),
        },

        button: {
            margin: "1em 0em",
            fontSize: "12px",
            borderRadius: "3px",
        },
    })),
    connect(
        (state) => ({
            loading: state.App.loading,
        }),
        (dispatch) => bindActionCreators({

        }, dispatch)
    )
)(({ classes, loading }) => {

    return (
        <Fragment>
            <Hidden mdUp>
                <Grid
                    container
                    direction={"column"}
                    justify={"space-around"}
                    alignItems={"center"}
                    wrap={"nowrap"}
                >
                    <Grid item>
                        {loading && <Loader infoMessage="Loading ..." />}
                        <Fade in={!loading}><div>
                            <ResetRequest />
                            <div style={{ opacity: "0.7" }}
                                className="flex-box-col space-between m-t-large"
                            >
                                <div className="flex-box-col">
                                    <Typography variant="caption">
                                        Already have an account?
                                    </Typography>
                                    <Button
                                        size="small"
                                        component={Link}
                                        to="/"
                                        color="secondary"
                                        className={classes.button}
                                        variant="outlined"
                                    >Log In</Button>
                                </div>
                            </div>
                        </div></Fade>
                    </Grid>
                </Grid>
            </Hidden>

            <Hidden smDown>
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
                            {loading && <Loader infoMessage="Loading ..." />}
                            <Fade in={!loading}><div>
                                <ResetRequest />
                                <div style={{ opacity: "0.7" }}
                                    className="flex-box-row space-between m-t-large"
                                >
                                    <div className="flex-box-col">
                                        <Typography variant="caption">
                                            Already have an account?
                                        </Typography>
                                        <Button
                                            size="small"
                                            component={Link}
                                            to="/"
                                            color="secondary"
                                            className={classes.button}
                                            variant="outlined"
                                        >Log In</Button>
                                    </div>
                                </div>
                            </div></Fade>
                        </Paper>
                    </Grid>
                </Grid>
            </Hidden>
        </Fragment>
    )
})
