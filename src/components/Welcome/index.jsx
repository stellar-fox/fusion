import React, { Fragment } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import { func } from "@xcmats/js-toolbox"
import { withStyles } from "@material-ui/core/styles"
import {
    Button,
    Fade,
    Grid,
    Hidden,
    Paper,
    Typography,
} from "@material-ui/core"
import { fade } from "@material-ui/core/styles/colorManipulator"
import UserLogin from "../UserLogin"
import { Link } from "react-router-dom"
import Awaiter from "../Awaiter"




// <Welcome> component
export default func.compose(
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
            error: state.Accounts.error,
            errorMessage: state.Accounts.errorMessage,
            disabled: state.UserLogin.disabled,
            loading: state.App.loading,
        }),
        (dispatch) => bindActionCreators({
            
        }, dispatch),
    ),
)(({ classes, disabled, loading }) => {

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
                        {loading ?
                            <Awaiter /> :
                            <Fade in><div>
                                <UserLogin />
                                <div style={{
                                    opacity: "0.7",
                                }} className="flex-box-col space-between m-t"
                                >
                                    <div className="flex-box-col">
                                        <Typography variant="h4">
                                            Did you forget password?
                                        </Typography>
                                        <Button
                                            size="small"
                                            component={Link}
                                            to="/reset"
                                            color="secondary"
                                            className={classes.button}
                                            disabled={disabled}
                                            variant="outlined"
                                        >Reset Password</Button>
                                    </div>
                                    <div className="flex-box-col">
                                        <Typography variant="h4">
                                            Don't have an account yet?
                                        </Typography>
                                        <Button
                                            size="small"
                                            component={Link}
                                            to="/signup"
                                            color="secondary"
                                            className={classes.button}
                                            disabled={disabled}
                                            variant="outlined"
                                        >Create Account</Button>
                                    </div>
                                </div>
                            </div></Fade>
                        }
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
                        {loading ?
                            <Awaiter /> :                            
                            <Paper elevation={2} className={classes.loginPaper}>
                                <Fade in><div>
                                    <UserLogin />
                                    <div style={{
                                        opacity: "0.7",
                                    }} className="flex-box-row space-between m-t"
                                    >
                                        <div className="flex-box-col">
                                            <Typography variant="h4">
                                                Did you forget password?
                                            </Typography>
                                            <Button
                                                size="small"
                                                component={Link}
                                                to="/reset"
                                                color="secondary"
                                                className={classes.button}
                                                disabled={disabled}
                                                variant="outlined"
                                            >Reset Password</Button>
                                        </div>
                                        <div className="flex-box-col">
                                            <Typography variant="h4">
                                                Don't have an account yet?
                                            </Typography>
                                            <Button
                                                size="small"
                                                component={Link}
                                                to="/signup"
                                                color="secondary"
                                                className={classes.button}
                                                disabled={disabled}
                                                variant="outlined"
                                            >Create Account</Button>
                                        </div>
                                    </div>
                                </div></Fade>
                            </Paper>
                        }
                    </Grid>
                </Grid>
            </Hidden>
        </Fragment>
    )
})
