import React, { Component, Fragment } from "react"
import { bindActionCreators, compose } from "redux"
import { connect } from "react-redux"
import { withStyles } from "@material-ui/core/styles"
import { Redirect, Route } from "react-router-dom"
import { Paper, Typography } from "@material-ui/core"
import { ConnectedSwitch as Switch, resolvePath } from "../FusionRouter"
import { Motion, presets, spring } from "react-motion"
import ShambhalaPureCard from "./ShambhalaPureCard"
import ShambhalaLedgerCard from "./ShambhalaLedgerCard"
import ShambhalaScepticCard from "./ShambhalaScepticCard"
import withWidth, { isWidthDown } from "@material-ui/core/withWidth"
import Snacky from "../../lib/mui-v1/Snacky"




// <KeyManagement> component
export default compose(
    withStyles((_theme) => ({
        paperCanvas: {
            padding: "10px",
        },

    })),
    connect(
        // map state to props.
        (_state) => ({}),
        // match dispatch to props.
        (dispatch) => bindActionCreators({}, dispatch)
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
        render = () => (
            ({ classes, width }) =>
                <Switch>
                    <Route exact path={this.rr(".")}>

                        <Paper className={classes.paperCanvas}>
                            <Snacky />
                            <Motion defaultStyle={{ x: -10, opacity: 0 }}
                                style={{
                                    x: spring(0, presets.stiff),
                                    opacity: spring(1),
                                }}
                            >
                                {value =>
                                    <Fragment>
                                        <Typography style={{
                                            position: "relative",
                                            WebkitTransform: `translate(${value.x}px, 0)`,
                                            transform: `translate(${value.x}px, 0)`,
                                            opacity: value.opacity,
                                        }} variant="h6"
                                        >
                                            Key Management
                                        </Typography>
                                        <div style={{
                                            position: "relative",
                                            WebkitTransform: `translate(${value.x}px, 0)`,
                                            transform: `translate(${value.x}px, 0)`,
                                            opacity: value.opacity,
                                        }} className={isWidthDown("sm", width) ?
                                            "m-t m-b flex-box-col items-centered" :
                                            "m-t m-b flex-box-row space-around"}
                                        >
                                            <ShambhalaPureCard />

                                            {isWidthDown("sm", width) &&
                                                <div className="m-b"></div>}

                                            <ShambhalaLedgerCard />

                                            {isWidthDown("sm", width) &&
                                                <div className="m-b"></div>}

                                            <ShambhalaScepticCard />
                                        </div>
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
