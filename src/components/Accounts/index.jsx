import React, { Component, Fragment } from "react"
import { bindActionCreators, compose } from "redux"
import { connect } from "react-redux"
import { withStyles } from "@material-ui/core/styles"
import { Redirect, Route } from "react-router-dom"
import { Grid, Paper, Typography } from "@material-ui/core"
import { ConnectedSwitch as Switch, resolvePath } from "../FusionRouter"
import { Motion, presets, spring } from "react-motion"
import { action as AccountsActions } from "../../redux/Accounts"
import Tab from "@material-ui/core/Tab"
import Tabs from "@material-ui/core/Tabs"
import SwipeableViews from "react-swipeable-views"




// <Accounts> component
export default compose(
    withStyles((theme) => ({
        indicator: {
            backgroundColor: theme.palette.custom.greenDark,
        },

        paperCanvas: {
            padding: "10px",
        },
    })),
    connect(
        // map state to props.
        (state, theme) => ({
            tabSelected: state.Accounts.tabSelected,
            theme,
        }),
        // match dispatch to props.
        (dispatch) => bindActionCreators({
            changeTab: AccountsActions.changeTab,
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
            ({ classes, tabSelected }) =>
                <Switch>
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
                                            <Tab label="Real Accounts" />
                                            <Tab label="Demo Accounts" />
                                        </Tabs>

                                        <SwipeableViews
                                            style={{
                                                position: "relative",
                                                WebkitTransform: `translate(${value.x}px, 0)`,
                                                transform: `translate(${value.x}px, 0)`,
                                                opacity: value.opacity,
                                            }}
                                            axis={this.props.theme.direction === "rtl" ? "x-reverse" : "x"}
                                            index={tabSelected}
                                            onChangeIndex={this.handleChangeIndex}
                                        >
                                            <Typography component="div"
                                                dir={this.props.theme.direction}
                                                style={{ padding: "1rem 0.5rem" }}
                                            >
                                                Real Accounts
                                            </Typography>

                                            <Typography component="div"
                                                dir={this.props.theme.direction}
                                                style={{ padding: "2rem 0" }}
                                            >
                                                Demo Accounts
                                            </Typography>

                                        </SwipeableViews>
                                    </Fragment>

                                }
                            </Motion>

                        </Paper>

                    </Route>
                    <Redirect to={this.rr(".")} />
                </Switch>
        )(this.props)

    }
)
