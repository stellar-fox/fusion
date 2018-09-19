import React, { Fragment } from "react"
import { compose } from "redux"
import { withStyles } from "@material-ui/core/styles"
import { url, rgba } from "../../lib/utils"
import { Button, Grid, Hidden, Paper } from "@material-ui/core"
import ResetRequest from "../../lib/mui-v1/ResetRequest"
import logo from "../Fusion/static/logo.svg"
import matte from "../Fusion/static/matte-01.jpg"
import { Link } from "react-router-dom"



// <PasswordReset> component
export default compose(
    withStyles((theme) => ({

        container: {
            backgroundImage: url(matte),
            backgroundPosition: "center center",
            backgroundSize: "cover",
            height: "100%",
        },

        appLogo: {
            ...theme.fusion.appLogo,
            height: "60px",
            margin: "40px",
        },

        loginPaper: {
            width: "460px",
            padding: "40px 80px 40px 80px",
            backgroundColor: rgba(29, 36, 46, 0.25),
        },
        button: {
            marginTop: "1em",
            lineHeight: "1em",
        },
    }))
)(({ classes, }) => {

    return (
        <Fragment>
            <Hidden mdUp>
                <Grid
                    container
                    direction={"column"}
                    justify={"space-around"}
                    alignItems={"center"}
                >
                    <Grid item>
                        <img
                            className={classes.appLogo}
                            src={logo} alt="logo"
                        />
                    </Grid>
                    <Grid item>
                        <ResetRequest />
                        <div className="flex-box-row space-between">
                            <Button size="small" component={Link} to="/"
                                variant="outlined" color="secondary"
                                className={classes.button}
                            >Log In</Button>
                        </div>
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
                >
                    <Grid item>
                        <img
                            className={classes.appLogo}
                            src={logo} alt="logo"
                        />
                    </Grid>
                    <Grid item>
                        <Paper elevation={2} className={classes.loginPaper}>
                            <ResetRequest />
                            <div className="flex-box-row space-between">
                                <Button size="small" component={Link} to="/"
                                    variant="outlined" color="secondary"
                                    className={classes.button}
                                >Log In</Button>
                            </div>
                        </Paper>
                    </Grid>
                    <Grid item>
                        <div className={classes.appLogo} />
                    </Grid>
                </Grid>
            </Hidden>
        </Fragment>
    )
})
