import React, { Component } from "react"
import { bindActionCreators, compose } from "redux"
import { connect } from "react-redux"
import { withStyles } from "@material-ui/core/styles"
import { Redirect, Route } from "react-router-dom"
import { Paper, Typography } from "@material-ui/core"
import { ConnectedSwitch as Switch, resolvePath } from "../FusionRouter"
import { Motion, presets, spring } from "react-motion"




// <Balances> component
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
    )
)(
    class extends Component {

        // ...
        constructor(props) {
            super(props)

            // relative resolve
            this.rr = resolvePath(this.props.match.path)
        }


        // ...
        render = () => (
            ({ classes, }) =>
                <Switch>
                    <Route exact path={this.rr(".")}>

                        <Paper className={classes.paperCanvas}>

                            <Motion defaultStyle={{ x: -10, opacity: 0, }}
                                style={{
                                    x: spring(0, presets.gentle),
                                    opacity: spring(1),
                                }}
                            >
                                {value =>
                                    <Typography style={{
                                        position: "relative",
                                        WebkitTransform: `translate(${value.x}px, 0)`,
                                        transform: `translate(${value.x}px, 0)`,
                                        opacity: value.opacity,
                                    }} variant="title"
                                    >
                                        Balances
                                    </Typography>
                                }
                            </Motion>

                        </Paper>

                    </Route>
                    <Redirect to={this.rr(".")} />
                </Switch>
        )(this.props)

    }
)
