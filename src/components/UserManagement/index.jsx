import React, { Component } from "react"
import PropTypes from "prop-types"
import { bindActionCreators, compose } from "redux"
import { connect } from "react-redux"
import { withStyles } from "@material-ui/core/styles"
import { Redirect, Route } from "react-router-dom"
import { Paper, Typography } from "@material-ui/core"
import { ConnectedSwitch as Switch, resolvePath } from "../FusionRouter"
import { Motion, presets, spring } from "react-motion"




// <UserManagement> component
export default compose(
    withStyles((_theme) => ({

        emoji: {
            fontSize: "2rem",
            lineHeight: "3rem",
            verticalAlign: "middle",
        },

        paperCanvas: {
            padding: "10px",
        },

    })),
    connect(
        // map state to props.
        (_state) => ({ /* ... */ }),
        // match dispatch to props.
        (dispatch) => bindActionCreators({ /* ... */ }, dispatch)
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
        render = () => (
            ({ classes, }) =>
                <Switch>
                    <Route exact path={this.rr(".")}>

                        <Paper className={classes.paperCanvas}>
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
                                H1 Roboto Condensed
                            </Typography>
                            <Typography variant="display2">
                                H2 Roboto Condensed
                            </Typography>
                            <Typography variant="display3">
                                H3 Eczar $ 12,345.67890
                            </Typography>
                            <Typography variant="display4">
                                H4 Roboto Condensed
                            </Typography>
                            <Typography variant="headline">
                                H5 (headline) Roboto Condensed
                            </Typography>
                            <Typography variant="title">
                                H6 (title) Roboto Condensed
                            </Typography>
                            <Typography variant="subheading">
                                Subtitle1 (subheading) Roboto Condensed
                            </Typography>
                            <Typography variant="body1">
                                Body1 Eczar $ 12,345.67890
                            </Typography>
                            <Typography variant="body2">
                                Body2 Roboto Condensed
                            </Typography>
                            <Typography variant="button">
                                Button Roboto Condensed
                            </Typography>
                            <Typography variant="caption">
                                Caption Roboto Condensed
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
                                <div className="bg-green" style={{ width: 10, height: 30, }}></div>
                                <div className="bg-dark-green" style={{ width: 10, height: 30, }}></div>
                                <div className="bg-orange" style={{ width: 10, height: 30, }}></div>
                                <div className="bg-yellow" style={{ width: 10, height: 30, }}></div>
                                <div className="bg-purple" style={{ width: 10, height: 30, }}></div>
                                <div className="bg-blue" style={{ width: 10, height: 30, }}></div>
                            </div>

                        </Paper>

                    </Route>
                    <Redirect to={this.rr(".")} />
                </Switch>
        )(this.props)

    }
)
