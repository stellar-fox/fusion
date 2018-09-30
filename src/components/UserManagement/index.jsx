import React, { Component } from "react"
import PropTypes from "prop-types"
import { bindActionCreators, compose } from "redux"
import { connect } from "react-redux"
import { withStyles } from "@material-ui/core/styles"
import { Redirect, Route } from "react-router-dom"
import { Button, IconButton, Paper, Snackbar, Typography } from "@material-ui/core"
import { Close } from "@material-ui/icons"
import { ConnectedSwitch as Switch, resolvePath } from "../FusionRouter"
import { Motion, presets, spring } from "react-motion"
import { action as AuthActions } from "../../redux/Auth"
import { action as UserManagementActions } from "../../redux/UserManagement"
import Tab from "@material-ui/core/Tab"
import Tabs from "@material-ui/core/Tabs"
import SwipeableViews from "react-swipeable-views"




// <UserManagement> component
export default compose(
    withStyles((theme) => ({
        close: {
            width: theme.spacing.unit * 4,
            height: theme.spacing.unit * 4,
        },

        paperCanvas: {
            padding: "10px",
        },

        indicator: {
            backgroundColor: theme.palette.custom.greenDark,
        },

    })),
    connect(
        // map state to props.
        (state, theme) => ({
            Auth: state.Auth,
            tabSelected: state.UserManagement.tabSelected,
            theme,
        }),
        // match dispatch to props.
        (dispatch) => bindActionCreators({
            sendEmailVerification: AuthActions.sendEmailVerification,
            sendPasswordReset: AuthActions.sendPasswordReset,
            changeTab: UserManagementActions.changeTab,
        }, dispatch)
    )
)(
    class extends Component {

        // ...
        static propTypes = {
            match: PropTypes.object.isRequired,
        }


        // ...
        constructor (props) {
            super(props)

            // relative resolve
            this.rr = resolvePath(this.props.match.path)
        }

        state = {
            open: false,
        }


        // ...
        onTabChange = (_event, value) =>
            this.props.changeTab(value)


        // ...
        closeSnackbar = () => this.setState({ open: false, })


        // ...
        popupSnackbar = (message) => this.setState({
            open: true,
            message,
        })


        // ...
        sendPasswordResetLink = () => {
            this.props.sendPasswordReset()
            this.popupSnackbar(`Password reset link sent to: ${this.props.Auth.email}.`)
        }


        // ...
        sendVerificationLink = () => {
            this.props.sendEmailVerification()
            this.popupSnackbar(`Verification link sent to: ${this.props.Auth.email}.`)
        }


        // ...
        render = () => (
            ({ classes, Auth, tabSelected, }) =>
                <Switch>
                    <Route exact path={this.rr(".")}>

                        <Paper className={classes.paperCanvas}>

                            <Snackbar
                                anchorOrigin={{
                                    vertical: "bottom",
                                    horizontal: "left",
                                }}
                                open={this.state.open}
                                autoHideDuration={3000}
                                onClose={this.closeSnackbar}
                                ContentProps={{
                                    "aria-describedby": "message-id",
                                }}
                                message={
                                    <span id="message-id">
                                        <Typography variant="body2" color="inherit">
                                            {this.state.message}
                                        </Typography>
                                    </span>
                                }
                                action={[
                                    <IconButton
                                        key="close"
                                        aria-label="Close"
                                        color="inherit"
                                        className={classes.close}
                                        onClick={this.closeSnackbar}
                                    >
                                        <Close />
                                    </IconButton>,
                                ]}
                            />

                            <Tabs
                                value={tabSelected}
                                onChange={this.onTabChange}
                                fullWidth
                                classes={{ indicator: classes.indicator, }}
                            >
                                <Tab disableRipple label="Profile" />
                                <Tab disableRipple label="Settings" />
                                <Tab disableRipple label="Security" />
                            </Tabs>

                            <SwipeableViews
                                axis={this.props.theme.direction === "rtl" ? "x-reverse" : "x"}
                                index={tabSelected}
                                onChangeIndex={this.handleChangeIndex}
                            >
                                <Typography component="div"
                                    dir={this.props.theme.direction}
                                    style={{ padding: "2rem 0", }}
                                >
                                    Profile
                                </Typography>
                                <Typography component="div"
                                    dir={this.props.theme.direction}
                                    style={{ padding: "2rem 0", }}
                                >
                                    Settings
                                </Typography>
                                <Typography component="div"
                                    dir={this.props.theme.direction}
                                    style={{ padding: "2rem 0", }}
                                >
                                    Security
                                </Typography>

                            </SwipeableViews>



                            <Typography variant="display1">
                                User: {Auth.uid}
                            </Typography>
                            <Typography variant="display1">
                                Email: {Auth.email} {Auth.emailVerified && "(verified)"}
                            </Typography>
                            <br />
                            <Button onClick={this.sendVerificationLink}>
                                Send Verification Link
                            </Button>
                            <br />
                            <br />
                            <Button onClick={this.sendPasswordResetLink}>
                                Send Password Reset Link
                            </Button>
                            <br />
                            <br />

                            <Motion defaultStyle={{ x: -10, }}
                                style={{ x: spring(5, presets.gentle), }}
                            >
                                {value =>
                                    <Typography style={{
                                        position: "relative",
                                        WebkitTransform: `translate(${value.x}px, 0)`,
                                        transform: `translate(${value.x}px, 0)`,
                                    }} variant="title"
                                    >
                                        Typography
                                    </Typography>
                                }
                            </Motion>

                            <Typography variant="display1">
                                display1: Roboto Condensed
                            </Typography>
                            <Typography variant="display2">
                                display2: Roboto Condensed
                            </Typography>
                            <Typography variant="display3">
                                display3: $ 12,345.67
                            </Typography>
                            <Typography variant="display4">
                                display4: Roboto Condensed
                            </Typography>
                            <Typography variant="headline">
                                headline: Eczar $ 12,345.67890
                            </Typography>
                            <Typography variant="title">
                                title: Roboto Condensed
                            </Typography>
                            <Typography variant="subheading">
                                subheading: Roboto Condensed
                            </Typography>
                            <Typography variant="body1">
                                body1: Eczar $ 12,345.67890
                            </Typography>
                            <Typography variant="body2">
                                body2: Roboto Condensed
                            </Typography>
                            <Typography variant="button">
                                button: Roboto Condensed
                            </Typography>
                            <Typography variant="caption">
                                caption: Roboto Condensed
                            </Typography>

                            <div style={{
                                fontSize: 10,
                                textTransform: "uppercase",
                                fontFamily: "'Roboto Condensed', sans-serif",
                            }}
                            >
                                Overline Roboto Condensed
                            </div>
                            <br />
                            <div className="flex-box-row space-around">
                                <div className="flex-box-row space-around">
                                    <div className="bg-green-darker" style={{ width: 10, height: 30, }}></div>
                                    <div className="bg-green-dark" style={{ width: 10, height: 30, }}></div>
                                    <div className="bg-green" style={{ width: 10, height: 30, }}></div>
                                    <div className="bg-green-light" style={{ width: 10, height: 30, }}></div>
                                </div>

                                <div className="flex-box-row space-around">
                                    <div className="bg-orange" style={{ width: 10, height: 30, }}></div>
                                    <div className="bg-orange-light" style={{ width: 10, height: 30, }}></div>
                                </div>

                                <div className="flex-box-row space-around">
                                    <div className="bg-yellow-dark" style={{ width: 10, height: 30, }}></div>
                                    <div className="bg-yellow" style={{ width: 10, height: 30, }}></div>
                                    <div className="bg-yellow-light" style={{ width: 10, height: 30, }}></div>
                                </div>

                                <div className="flex-box-row space-around">
                                    <div className="bg-purple-dark" style={{ width: 10, height: 30, }}></div>
                                    <div className="bg-purple" style={{ width: 10, height: 30, }}></div>
                                    <div className="bg-purple-light" style={{ width: 10, height: 30, }}></div>
                                </div>

                                <div className="flex-box-row space-around">
                                    <div className="bg-blue-dark" style={{ width: 10, height: 30, }}></div>
                                    <div className="bg-blue" style={{ width: 10, height: 30, }}></div>
                                    <div className="bg-blue-light" style={{ width: 10, height: 30, }}></div>
                                </div>

                            </div>

                        </Paper>

                    </Route>
                    <Redirect to={this.rr(".")} />
                </Switch>
        )(this.props)

    }
)
