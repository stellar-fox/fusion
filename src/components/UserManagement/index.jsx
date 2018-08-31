import React, { Component, Fragment } from "react"
import PropTypes from "prop-types"
import {
    bindActionCreators,
    compose,
} from "redux"
import { connect } from "react-redux"
import { withStyles } from "@material-ui/core/styles"
import {
    Redirect,
    Route,
} from "react-router-dom"

import { emoji } from "../../lib/utils"

import {
    Paper,
    Typography,
} from "@material-ui/core"

import {
    ConnectedSwitch as Switch,
    resolvePath,
} from "../FusionRouter"




// <UserManagement> component
export default compose(
    withStyles((_theme) => ({

        emoji: {
            fontSize: "2rem",
            lineHeight: "3rem",
            verticalAlign: "middle",
        },

        paperCanvas: {
            backgroundColor: "rgb(156, 157, 162)",
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
                        <Fragment>
                            <Paper className={classes.paperCanvas}>
                                <Typography noWrap>
                                    <span className={classes.emoji}>
                                        <emoji.Bomb />
                                    </span>
                                    &nbsp;&nbsp;&nbsp;&nbsp;
                                    Hello, <b>FUSION-UserManagement</b>!
                                    &nbsp;&nbsp;&nbsp;&nbsp;
                                    <span className={classes.emoji}>
                                        <emoji.Boom />
                                    </span>
                                </Typography>
                            </Paper>
                        </Fragment>
                    </Route>
                    <Redirect to={this.rr(".")} />
                </Switch>
        )(this.props)

    }
)
