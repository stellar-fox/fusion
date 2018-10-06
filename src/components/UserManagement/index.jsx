import React, { Component } from "react"
import PropTypes from "prop-types"
import { bindActionCreators, compose } from "redux"
import { connect } from "react-redux"
import { withStyles } from "@material-ui/core/styles"
import { Redirect, Route } from "react-router-dom"
import { Paper, Typography } from "@material-ui/core"
import { ConnectedSwitch as Switch, resolvePath } from "../FusionRouter"
import { action as AuthActions } from "../../redux/Auth"
import { action as UserManagementActions } from "../../redux/UserManagement"
import Tab from "@material-ui/core/Tab"
import Tabs from "@material-ui/core/Tabs"
import SwipeableViews from "react-swipeable-views"
import Profile from "./Profile"
import Snacky from "../../lib/mui-v1/Snacky"




// <UserManagement> component
export default compose(
    withStyles((theme) => ({

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
            snackyOpen: state.Snacky.open,
            snackyMessage: state.Snacky.message,
            cropInProgress: state.UserManagement.cropInProgress,
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


        // ...
        onTabChange = (_event, value) => this.props.changeTab(value)


        // ...
        render = () => (
            ({ classes, cropInProgress, tabSelected, }) =>
                <Switch>
                    <Route exact path={this.rr(".")}>

                        <Paper className={classes.paperCanvas}>
                            <Snacky />

                            <Tabs
                                value={tabSelected}
                                onChange={this.onTabChange}
                                fullWidth
                                classes={{ indicator: classes.indicator, }}
                            >
                                <Tab label="Profile" />
                                <Tab label="Settings" />
                                <Tab label="Security" />
                            </Tabs>

                            <SwipeableViews
                                axis={this.props.theme.direction === "rtl" ? "x-reverse" : "x"}
                                index={tabSelected}
                                onChangeIndex={this.handleChangeIndex}
                                disabled={cropInProgress}
                            >
                                <Typography component="div"
                                    dir={this.props.theme.direction}
                                    style={{ padding: "1rem 0.5rem", }}
                                >
                                    <Profile />
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


                            {/* <Motion defaultStyle={{ x: -10, }}
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

                            </div> */}

                        </Paper>

                    </Route>
                    <Redirect to={this.rr(".")} />
                </Switch>
        )(this.props)

    }
)
