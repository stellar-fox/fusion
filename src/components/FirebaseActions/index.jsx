import React, { Component, Fragment } from "react"
import { bindActionCreators, compose } from "redux"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import { withStyles } from "@material-ui/core/styles"
import { url, rgba } from "../../lib/utils"
import { Grid, Hidden, Paper, Typography, } from "@material-ui/core"
import logo from "../Fusion/static/logo.svg"
import matte from "../Fusion/static/matte-01.jpg"
import queryString from "query-string"
import { action as AuthActions } from "../../redux/Auth"
import { emptyString } from "@xcmats/js-toolbox"



// <COMPONENT_NAME> component
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
    })),
    connect(
        (state) => ({
            emailVerified: state.Auth.emailVerified,
            emailVerificationMessage: state.Auth.emailVerificationMessage,
        }),
        (dispatch) => bindActionCreators({
            verify: AuthActions.verify,
        }, dispatch)
    )
)(
    class extends Component {

        // ...
        static propTypes = {
            classes: PropTypes.object.isRequired,
        }


        // ...
        state = {
            status: emptyString(),

        }


        componentDidMount = () => ((qs) => {
            const mode = qs.mode,
                oobCode = qs.oobCode

            mode === "verifyEmail" && this.props.verify(oobCode)
        })(
            queryString.parse(
                this.props.location.search,
                { ignoreQueryPrefix: true, }
            )
        )

        // ...
        render = () => (
            ({ classes, emailVerified, emailVerificationMessage, }) => {


                return <Fragment>
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
                                {emailVerified ?
                                    <Fragment>
                                        <Typography variant="body2">
                                            Email verified.
                                        </Typography>
                                        <Typography variant="display1">
                                            Please log-in to your account.
                                        </Typography>
                                    </Fragment> :
                                    <Fragment>
                                        <Typography variant="body2">
                                            Email could not be verified.
                                        </Typography>
                                        <Typography variant="display1">
                                            {emailVerificationMessage}
                                        </Typography>
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
                        >
                            <Grid item>
                                <img
                                    className={classes.appLogo}
                                    src={logo} alt="logo"
                                />
                            </Grid>
                            <Grid item>
                                <Paper elevation={2} className={classes.loginPaper}>
                                    {emailVerified ?
                                        <Fragment>
                                            <Typography variant="subheading">
                                                Email verified.
                                            </Typography>
                                            <Typography variant="body2">
                                                Please log-in to your account.
                                            </Typography>
                                        </Fragment> :
                                        <Fragment>
                                            <Typography variant="subheading">
                                                Email could not be verified.
                                            </Typography>
                                            <Typography variant="body2">
                                                {emailVerificationMessage}
                                            </Typography>
                                        </Fragment>
                                    }
                                </Paper>
                            </Grid>
                            <Grid item>
                                <div className={classes.appLogo} />
                            </Grid>
                        </Grid>
                    </Hidden>

                </Fragment>
            }
        )(this.props)

    }
)
