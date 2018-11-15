import React, { Fragment } from "react"
import { compose } from "redux"
import { withStyles } from "@material-ui/core/styles"
import { url, rgba } from "../../lib/utils"
import { Button, Grid, Hidden, Paper } from "@material-ui/core"
import UserLogin from "../UserLogin"
import background from "../Fusion/static/bg.png"
import { Link } from "react-router-dom"




// <Welcome> component
export default compose(
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
                        <UserLogin />
                        <div className="flex-box-row space-between">
                            <Button size="small" component={Link} to="/reset"
                                variant="outlined" color="secondary"
                                className={classes.button}
                            >Reset Password</Button>
                            <Button size="small" component={Link} to="/signup"
                                variant="outlined" color="secondary"
                                className={classes.button}
                            >Signup</Button>
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
                    wrap={"nowrap"}
                >
                    <Grid item>
                        <Paper elevation={2} className={classes.loginPaper}>
                            <UserLogin />
                            <div className="flex-box-row space-between m-t-small">
                                <Button size="small" component={Link} to="/reset"
                                    variant="outlined" color="secondary"
                                    className={classes.button}
                                >Reset Password</Button>
                                <Button size="small" component={Link} to="/signup"
                                    variant="outlined" color="secondary"
                                    className={classes.button}
                                >Signup</Button>
                            </div>
                        </Paper>
                    </Grid>
                </Grid>
            </Hidden>
        </Fragment>
    )
})
