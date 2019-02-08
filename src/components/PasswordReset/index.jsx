import React, { Fragment } from "react"
import { compose } from "redux"
import { withStyles } from "@material-ui/core/styles"
import {
    Button,
    Fade,
    Grid,
    Hidden,
    Paper
} from "@material-ui/core"
import ResetRequest from "../ResetRequest"
import { Link } from "react-router-dom"
import { fade } from "@material-ui/core/styles/colorManipulator"




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
    }))
)(({ classes }) => {

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
                        <Fade in><div>
                            <ResetRequest />
                            <div className="flex-box-row space-between">
                                <Button size="small" component={Link} to="/"
                                    color="secondary" className={classes.button}
                                >Log In</Button>
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
                            <Fade in><div>
                                <ResetRequest />
                                <div className="flex-box-row space-between m-t-small">
                                    <Button size="small" component={Link} to="/"
                                        color="secondary" className={classes.button}
                                    >Log In</Button>
                                </div>
                            </div></Fade>
                        </Paper>
                    </Grid>
                </Grid>
            </Hidden>
        </Fragment>
    )
})
