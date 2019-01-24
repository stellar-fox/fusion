import React, { Component, Fragment } from "react"
import { bindActionCreators, compose } from "redux"
import { connect } from "react-redux"
import { withStyles } from "@material-ui/core/styles"
import { Redirect, Route } from "react-router-dom"
import {
    Grid,
    Paper,
    Tab,
    Tabs,
    Typography,
} from "@material-ui/core"
import SwipeableViews from "react-swipeable-views"
import { ConnectedSwitch as Switch, resolvePath } from "../FusionRouter"
import RosterReal from "./RosterReal"
import RosterDemo from "./RosterDemo"
import { action as BalancesActions } from "../../redux/Balances"
import ModalPay from "./ModalPay"




// <Balances> component
export default compose(
    withStyles((theme) => ({
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
        },
    })),
    connect(
        // map state to props.
        (state) => ({
            height: state.App.dim.height,
            tabSelected: state.Balances.tabSelected,
        }),
        // match dispatch to props.
        (dispatch) => bindActionCreators({
            changeTab: BalancesActions.changeTab,
        }, dispatch)
    )
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
            ({ classes, height, tabSelected }) =>
                <Switch>
                    <Route exact path={this.rr(".")}>

                        <Paper style={{
                            height: height - 90,
                        }} className={classes.paperCanvas}
                        >
                            <ModalPay />
                            
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
                                        }} variant="h6"
                                        >
                                            Balances
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography style={{
                                            position: "relative",
                                        }} variant="h4"
                                        >
                                            Overview of your accounts in one place.
                                        </Typography>
                                    </Grid>
                                </Grid>

                                <Tabs
                                    style={{
                                        position: "relative",
                                    }}
                                    value={tabSelected}
                                    onChange={this.onTabChange}
                                    variant="fullWidth"
                                    classes={{ indicator: classes.indicator }}
                                >
                                    <Tab classes={{ label: classes.labelRealAccounts }} label="Real" />
                                    <Tab classes={{ label: classes.labelDemoAccounts }} label="Demo" />
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
                                    <RosterReal />
                                    <RosterDemo />
                                </SwipeableViews>

                            </Fragment>
                                

                        </Paper>

                    </Route>
                    <Redirect to={this.rr(".")} />
                </Switch>
        )(this.props)

    }
)
