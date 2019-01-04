import React, { Fragment } from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import { withStyles } from "@material-ui/core/styles"
import withWidth, { isWidthUp } from "@material-ui/core/withWidth"
import {
    Fab,
    Grid,
    Tab,
    Tabs,
    Typography,
    Zoom,
} from "@material-ui/core"
import { AddRounded } from "@material-ui/icons"
import SwipeableViews from "react-swipeable-views"
import AccountCard from "./AccountCard"
import { Motion, presets, spring } from "react-motion"
import {
    func,
} from "@xcmats/js-toolbox"
import {
    getDemoAccounts,
    getRealAccounts,
} from "../../lib/logic/stellarAccount"
import { accountType as at } from "../../redux/Accounts"
import { action as AccountsActions } from "../../redux/Accounts"




/**
 * Fusion.
 *
 * Main content view.
 *
 * @module Accounts
 * @license Apache-2.0
 */
const MainContent = ({
    changeTab, classes, demoAccounts, realAccounts, tabSelected, width,
}) => {
    
    const transitionDuration = {
        enter: 225,
        exit: 195,
    }

    return <Motion defaultStyle={{ x: -10, opacity: 0 }}
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
                                transitionDelay: `${tabSelected === 0 ?
                                    transitionDuration.exit : 0}ms`,
                            }}
                            unmountOnExit
                        >
                            <Fab aria-label="Add Real" size="small"
                                className={classes.fab}
                                classes={{ root: classes.fabReal }}
                                onClick={() => {
                                    console.log("create new real account")
                                }}
                            >
                                <AddRounded />
                            </Fab>
                        </Zoom>

                        <Zoom
                            key="add-demo"
                            in={tabSelected === 1}
                            timeout={transitionDuration}
                            style={{
                                transitionDelay: `${tabSelected === 1 ?
                                    transitionDuration.exit : 0}ms`,
                            }}
                            unmountOnExit
                        >
                            <Fab aria-label="Add Demo" size="small"
                                className={classes.fab}
                                classes={{ root: classes.fabDemo }}
                                onClick={() => {
                                    console.log("create new demo account")
                                }}
                            >
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
                    onChange={(_e, value) => changeTab(value)}
                    variant="fullWidth"
                    classes={{ indicator: classes.indicator }}
                >
                    <Tab classes={{ label: classes.labelRealAccounts }}
                        label="Real"
                    />
                    <Tab classes={{ label: classes.labelDemoAccounts }}
                        label="Demo"
                    />
                </Tabs>

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
                        style={{ position: "relative" }}
                        className="m-t m-b"
                        classes={{ "spacing-xs-8": classes.spacing }}
                    >
                        {realAccounts.map((account) =>
                            <Grid key={`${account.accountId}-${at.REAL}`} item>
                                <AccountCard accountId={account.accountId}
                                    accountType={at.REAL}
                                />
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
                                <AccountCard accountId={account.accountId}
                                    accountType={at.DEMO}
                                />
                            </Grid>
                        )}
                    </Grid>
                </SwipeableViews>
            </Fragment>
        }
    </Motion>    
}


// ...
export default func.compose(
    withStyles((theme) => ({

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

        spacing: {
            width: "100%",
            margin: "0.5rem 0 0 0",
        },

    })),
    withWidth(),
    connect(
        (state) => ({
            tabSelected: state.Accounts.tabSelected,
            realAccounts: getRealAccounts(state.StellarAccounts),
            demoAccounts: getDemoAccounts(state.StellarAccounts),
        }),
        (dispatch) => bindActionCreators({
            changeTab: AccountsActions.changeTab,
        }, dispatch)
    ),
)(MainContent)
