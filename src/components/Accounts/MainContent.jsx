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
import { func } from "@xcmats/js-toolbox"
import {
    getDemoAccounts,
    getRealAccounts,
} from "../../lib/logic/stellarAccount"
import { accountType as at } from "../../redux/Accounts"
import { action as AccountsActions } from "../../redux/Accounts"
import { addAccount } from "../../thunks/AddAccount/"




/**
 * Fusion.
 *
 * Main content view.
 *
 * @module client-ui-components
 * @license Apache-2.0
 */




/**
 * `<MainContent>` component.
 *
 * @function MainContent
 * @returns {React.ReactElement}
 */
const MainContent = ({
    changeTab, classes, demoAccounts, height, realAccounts, addAccount,
    tabSelected, width,
}) => {
    
    const transitionDuration = {
        enter: 225,
        exit: 195,
    }

    return <Fragment>
        <Grid
            container
            direction={"column"}
            wrap={"nowrap"}
            style={{ position: "relative" }}
            className="m-b"
        >
            <Grid item>
                <Typography variant="h6">
                    Accounts
                </Typography>
            </Grid>
            <Grid item>
                <Typography variant="h4">
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
                        onClick={() => addAccount(at.REAL)}
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
                        onClick={() => addAccount(at.DEMO)}
                    >
                        <AddRounded />
                    </Fab>
                </Zoom>
            </Grid>
        </Grid>

        <Tabs
            style={{
                position: "relative",
            }}
            value={tabSelected}
            onChange={(_e, value) => changeTab(value)}
            variant="fullWidth"
            classes={{ indicator: func.choose(tabSelected, {
                0: () => classes.indicatorGreen,
                1: () => classes.indicatorRed, 
            }, () => classes.indicator) }}
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
                height: height - 220,
            }}
            slideStyle={{
                height: height - 220,
            }}
            index={tabSelected}
        >
            {realAccounts.length === 0 ? <div
                className="flex-box-col items-centered content-centered"
                style={{
                    marginTop: "10%",
                    opacity: 0.3,
                }}
            >
                <Typography variant={isWidthUp("md", width) ? "h1" : "h4"}>
                    You have no real accounts at the moment.
                </Typography>
                <Typography variant={isWidthUp("md", width) ? "h4" : "h3"}>
                    Open one today! It only takes 15 seconds.
                </Typography>
            </div> :
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
            }

            {demoAccounts.length === 0 ? <div
                className="flex-box-col items-centered content-centered"
                style={{
                    marginTop: "10%",
                    opacity: 0.3,
                }}
            >
                <Typography variant="h1">
                    You have no demo accounts at the moment.
                </Typography>
                <Typography variant="h4">
                    Open one today! It only takes 15 seconds.
                </Typography>
            </div> :
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
            }
        </SwipeableViews>
    </Fragment>   
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

        indicatorGreen: {
            backgroundColor: theme.palette.custom.greenDark,
        },
        
        indicatorRed: {
            backgroundColor: theme.palette.error.main,
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
            height: state.App.dim.height,
            tabSelected: state.Accounts.tabSelected,
            realAccounts: getRealAccounts(state.StellarAccounts),
            demoAccounts: getDemoAccounts(state.StellarAccounts),
        }),
        (dispatch) => bindActionCreators({
            changeTab: AccountsActions.changeTab,
            addAccount,
        }, dispatch)
    ),
)(MainContent)
