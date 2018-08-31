import React from "react"
import { compose } from "redux"
import { withStyles } from "@material-ui/core/styles"
import {
    url,
    rgba,
} from "../../lib/utils"

import {
    Grid,
    Paper,
} from "@material-ui/core"

import UserLogin from "../../lib/mui-v1/UserLogin"

import logo from "../Fusion/static/logo.svg"
import matte from "../Fusion/static/matte-01.jpg"




// <Welcome> component
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
            height: "80px",
            margin: "20px",
        },

        loginPaper: {
            width: "460px",
            padding: "40px 80px 40px 80px",
            backgroundColor: rgba(29, 36, 46, 0.25),
        },
    }))
)(({ classes, }) =>
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
                <UserLogin />
            </Paper>
        </Grid>
        <Grid item>
            <div className={classes.appLogo} />
        </Grid>
    </Grid>
)
