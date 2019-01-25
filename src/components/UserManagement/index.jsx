import React, { Component, Fragment } from "react"
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
import Fade from "@material-ui/core/Fade"




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
            ({ classes, cropInProgress, tabSelected }) =>
                <Switch>
                    <Route exact path={this.rr(".")}>

                        <Fade in={true} timeout={{
                            enter: 700,
                            exit: 300,
                        }}
                        >
                            <Paper className={classes.paperCanvas}>
                                <Snacky />
                                
                                <Fragment>
                                    <Tabs
                                        value={tabSelected}
                                        onChange={this.onTabChange}
                                        variant="fullWidth"
                                        classes={{ indicator: classes.indicator }}
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
                                            style={{ padding: "1rem 0.5rem" }}
                                        >
                                            <Profile />
                                        </Typography>

                                        <Typography component="div"
                                            dir={this.props.theme.direction}
                                            style={{ padding: "2rem 0" }}
                                        >
                                            Settings
                                        </Typography>
                                        <Typography component="div"
                                            dir={this.props.theme.direction}
                                            style={{ padding: "2rem 0" }}
                                        >
                                            Security
                                        </Typography>

                                    </SwipeableViews>
                                </Fragment>
                            </Paper>
                        </Fade>
                    </Route>
                    <Redirect to={this.rr(".")} />
                </Switch>
        )(this.props)

    }
)
