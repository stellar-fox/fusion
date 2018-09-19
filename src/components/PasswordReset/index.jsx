import React, { Fragment } from "react"
import { compose } from "redux"
import { withStyles } from "@material-ui/core/styles"
import { url, rgba } from "../../lib/utils"
import { Grid, Hidden, Paper } from "@material-ui/core"
import ResetRequest from "../../lib/mui-v1/ResetRequest"
import logo from "../Fusion/static/logo.svg"
import matte from "../Fusion/static/matte-01.jpg"




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
                    style={{ height: "100%", }}
                >
                    <Grid item>
                        <img
                            className={classes.appLogo}
                            src={logo} alt="logo"
                        />
                    </Grid>
                    <Grid item>
                        <ResetRequest />
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
