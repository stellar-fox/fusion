import React, { Fragment } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import { func } from "@xcmats/js-toolbox"
import { withStyles } from "@material-ui/core/styles"
import { url, rgba } from "../../lib/utils"
import { Button, Grid, Hidden, Paper } from "@material-ui/core"
import UserLogin from "../UserLogin"
import background from "../Fusion/static/bg.png"
import { Link } from "react-router-dom"
import Awaiter from "../Awaiter"




// <Welcome> component
export default func.compose(
    withStyles((_theme) => ({

        container: {
            backgroundImage: url(background),
            backgroundPosition: "center center",
            backgroundSize: "cover",
            height: "100%",
        },

        loginPaper: {
            width: "460px",
            padding: "40px 80px 40px 80px",
            backgroundColor: rgba(29, 36, 46, 0.25),
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
            loading: state.App.loading,
        }),
        (dispatch) => bindActionCreators({
            
        }, dispatch),
    ),
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
                        {loading ?
                            <Awaiter /> :
                            <Fragment>
                                <UserLogin />
                                <div className="flex-box-row space-between">
                                    <Button size="small" component={Link} to="/reset"
                                        color="secondary"
                                        className={classes.button}
                                    >Reset Password</Button>
                                    <Button size="small" component={Link} to="/signup"
                                        color="secondary"
                                        className={classes.button}
                                    >Signup</Button>
                                </div>
                            </Fragment>
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
                            <Fragment>
                                <Paper elevation={2} className={classes.loginPaper}>
                                    <UserLogin />
                                    <div className="flex-box-row space-between m-t-small">
                                        <Button size="small" component={Link} to="/reset"
                                            color="secondary"
                                            className={classes.button}
                                        >Reset Password</Button>
                                        <Button size="small" component={Link} to="/signup"
                                            color="secondary"
                                            className={classes.button}
                                        >Signup</Button>
                                    </div>
                                </Paper>
                            </Fragment>
                        }
                    </Grid>
                </Grid>
            </Hidden>
        </Fragment>
    )
})
