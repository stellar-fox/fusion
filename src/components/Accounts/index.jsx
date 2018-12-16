import React, { Component, Fragment } from "react"
import { bindActionCreators, compose } from "redux"
import { connect } from "react-redux"
import { withStyles } from "@material-ui/core/styles"
import { Redirect, Route } from "react-router-dom"
import withWidth, { isWidthUp } from "@material-ui/core/withWidth"
import {
    Fab,
    Grid,
    Paper,
    Tab,
    Tabs,
    Typography,
    Zoom,
} from "@material-ui/core"
import { AddRounded } from "@material-ui/icons"
import { ConnectedSwitch as Switch, resolvePath } from "../FusionRouter"
import { Motion, presets, spring } from "react-motion"
import { action as AccountsActions } from "../../redux/Accounts"
import SwipeableViews from "react-swipeable-views"
import {
    getDemoAccounts,
    getRealAccounts,
} from "../../lib/logic/stellarAccount"
import AccountCard from "./AccountCard"
import { accountType as at } from "../../redux/Accounts"
import Awaiter from "../Awaiter"




// <Accounts> component
export default compose(
    withStyles((theme) => ({

        awaiter: {
            position: "absolute",
            left: 0,
            top: "50%",
            bottom: 0,
            right: 0,
            margin: "auto",
        },

        fab: {
            position: "absolute",
            right: "1rem",
            top: "0.5rem",
        },

        fabDemo: {
            backgroundColor: theme.palette.error.dark,
            color: theme.palette.common.white,
            "&:hover": {
                backgroundColor: theme.palette.error.main,
            },
        },

        fabReal: {
            backgroundColor: theme.palette.custom.greenDark,
            color: theme.palette.common.white,
            "&:hover": {
                backgroundColor: theme.palette.custom.green,
            },
        },

        indicator: {
            backgroundColor: theme.palette.custom.greenDark,
        },

        labelRealAccounts: {
            color: theme.palette.custom.green,
        },

        labelDemoAccounts: {
            color: theme.palette.error.main,
        },

        paperCanvas: {
            padding: "10px",
            height: "calc(100vh - 84px)",
        },

        spacing: {
            width: "100%",
            margin: "0.5rem 0 0 0",
        },

    })),
    connect(
        // map state to props.
        (state) => ({
            tabSelected: state.Accounts.tabSelected,
            realAccounts: getRealAccounts(state.StellarAccounts),
            demoAccounts: getDemoAccounts(state.StellarAccounts),
            loading: state.Awaiter.loading,
        }),
        // match dispatch to props.
        (dispatch) => bindActionCreators({
            changeTab: AccountsActions.changeTab,
        }, dispatch)
    ),
    withWidth(),
)(
    class extends Component {

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
            ({ classes, demoAccounts, loading, realAccounts, tabSelected, width }) => {

                const transitionDuration = {
                    enter: 225,
                    exit: 195,
                }

                return <Switch>
                    <Route exact path={this.rr(".")}>

                        <Paper className={classes.paperCanvas}>

                            <Motion defaultStyle={{ x: -10, opacity: 0 }}
                                style={{
                                    x: spring(0, presets.stiff),
                                    opacity: spring(1),
                                }}
                            >
                                {value =>
                                    <Fragment>
                                        <Grid
                                            container
                                            direction={"column"}
                                            wrap={"nowrap"}
                                            style={{ position: "relative" }}
                                            className="m-b"
                                        >
                                            <Grid item>
                                                <Typography style={{
                                                    position: "relative",
                                                    WebkitTransform: `translate(${value.x}px, 0)`,
                                                    transform: `translate(${value.x}px, 0)`,
                                                    opacity: value.opacity,
                                                }} variant="h6"
                                                >
                                                    Accounts
                                                </Typography>
                                            </Grid>
                                            <Grid item>
                                                <Typography style={{
                                                    position: "relative",
                                                    WebkitTransform: `translate(${value.x}px, 0)`,
                                                    transform: `translate(${value.x}px, 0)`,
                                                    opacity: value.opacity,
                                                }} variant="h4"
                                                >
                                                    Manage all your accounts in one place.
                                                </Typography>
                                            </Grid>
                                            <Grid item>
                                                <Zoom
                                                    key="add-real"
                                                    in={tabSelected === 0}
                                                    timeout={transitionDuration}
                                                    style={{
                                                        transitionDelay: `${tabSelected === 0 ? transitionDuration.exit : 0}ms`,
                                                    }}
                                                    unmountOnExit
                                                >
                                                    <Fab aria-label="Add Real" size="small" className={classes.fab} classes={{ root: classes.fabReal }}>
                                                        <AddRounded />
                                                    </Fab>
                                                </Zoom>

                                                <Zoom
                                                    key="add-demo"
                                                    in={tabSelected === 1}
                                                    timeout={transitionDuration}
                                                    style={{
                                                        transitionDelay: `${tabSelected === 1 ? transitionDuration.exit : 0}ms`,
                                                    }}
                                                    unmountOnExit
                                                >
                                                    <Fab aria-label="Add Demo" size="small" className={classes.fab} classes={{ root: classes.fabDemo }}>
                                                        <AddRounded />
                                                    </Fab>
                                                </Zoom>
                                            </Grid>
                                        </Grid>



                                        <Tabs
                                            style={{
                                                position: "relative",
                                                WebkitTransform: `translate(${value.x}px, 0)`,
                                                transform: `translate(${value.x}px, 0)`,
                                                opacity: value.opacity,
                                            }}
                                            value={tabSelected}
                                            onChange={this.onTabChange}
                                            fullWidth
                                            classes={{ indicator: classes.indicator }}
                                        >
                                            <Tab classes={{ label: classes.labelRealAccounts }} label="Real" />
                                            <Tab classes={{ label: classes.labelDemoAccounts }} label="Demo" />
                                        </Tabs>

                                        {loading ? <div className={classes.awaiter}>
                                            <Awaiter /></div> :
                                            <SwipeableViews
                                                style={{
                                                    position: "relative",
                                                    WebkitTransform: `translate(${value.x}px, 0)`,
                                                    transform: `translate(${value.x}px, 0)`,
                                                    opacity: value.opacity,
                                                }}
                                                index={tabSelected}
                                            >
                                                <Grid
                                                    container
                                                    direction={isWidthUp("md", width) ? "row" : "column"}
                                                    spacing={8}
                                                    style={{ position: "relative"}}
                                                    className="m-t m-b"
                                                    classes={{ "spacing-xs-8": classes.spacing }}
                                                >
                                                    {realAccounts.map((account) =>
                                                        <Grid key={`${account.accountId}-${at.REAL}`} item>
                                                            <AccountCard accountId={account.accountId} accountType={at.REAL} />
                                                        </Grid>
                                                    )}
                                                </Grid>

                                                <Grid
                                                    container
                                                    direction={isWidthUp("md", width) ? "row" : "column"}
                                                    spacing={8}
                                                    style={{ position: "relative" }}
                                                    className="m-t m-b"
                                                    classes={{ "spacing-xs-8": classes.spacing }}
                                                >
                                                    {demoAccounts.map((account) =>
                                                        <Grid key={`${account.accountId}-${at.DEMO}`} item>
                                                            <AccountCard accountId={account.accountId} accountType={at.DEMO} />
                                                        </Grid>
                                                    )}
                                                </Grid>

                                            </SwipeableViews>
                                        }
                                    </Fragment>

                                }
                            </Motion>

                        </Paper>

                    </Route>
                    <Redirect to={this.rr(".")} />
                </Switch>
            })(this.props)

    }
)
