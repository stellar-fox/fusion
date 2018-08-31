import React, { Component, Fragment } from "react"
import PropTypes from "prop-types"
import { compose, bindActionCreators } from "redux"
import { connect } from "react-redux"
import { Redirect, Route } from "react-router-dom"
import raf from "raf"
import { toBool } from "@xcmats/js-toolbox"
import { action as SnackbarAction } from "../../redux/Snackbar"
import {
    ConnectedSwitch as Switch, resolvePath, withStaticRouter,
} from "../FusionRouter"
import { Null } from "../../lib/utils"
import Snackbar from "../../lib/mui-v1/Snackbar"
import Welcome from "../Welcome"
import { Typography } from "@material-ui/core"




// <Layout> component
export default compose(
    withStaticRouter,
    connect(
        // map state to props.
        (state) => ({
            authenticated: toBool(state.Auth.authToken),
            snackbarMessage: state.Snackbar.message,
            snackbarState: state.Snackbar.visible,
        }),
        // map actions to props.
        (dispatch) => bindActionCreators({
            resetSnackbar: SnackbarAction.reset,
        }, dispatch)
    )
)(
    class extends Component {

        // ...
        static propTypes = {
            authenticated: PropTypes.bool.isRequired,
            match: PropTypes.object.isRequired,
            resetSnackbar: PropTypes.func.isRequired,
            snackbarMessage: PropTypes.string.isRequired,
            snackbarState: PropTypes.bool.isRequired,
            staticRouter: PropTypes.object.isRequired,
        }


        // ...
        constructor (props) {
            super(props)

            // relative resolve
            this.rr = resolvePath(this.props.match.path)

            // static paths
            this.props.staticRouter.addPaths({
                "welcome": this.rr("."),
                "dashboard": this.rr("dashboard/"),
            })
        }


        // ...
        state = { Dashboard: Null, }


        // ...
        componentDidMount = () => raf(() =>
            import("../Dashboard")
                .then((D) => this.setState(
                    () => ({ Dashboard: D.default, })
                ))
        )


        // ...
        onAutoClose = () => this.props.resetSnackbar()


        // ...
        renderWelcome = (routeProps) =>
            !this.props.authenticated ?
                <Welcome {...routeProps} /> :
                <Redirect to={this.props.staticRouter.getPath("dashboard")} />


        // ...
        renderDashboard = (routeProps) =>
            this.props.authenticated ?
                <this.state.Dashboard {...routeProps} /> :
                <Redirect to={this.props.staticRouter.getPath("welcome")} />


        // ...
        render = () => (
            (getPath) =>
                <Fragment>
                    <Snackbar open={this.props.snackbarState}
                        message={
                            <Typography style={{paddingTop: "5px",}}
                                variant="body1" color="primary"
                            >
                                {this.props.snackbarMessage}
                            </Typography>
                        }
                        onClose={this.onAutoClose}
                    />
                    <Switch>
                        <Route exact path={getPath("welcome")}>
                            { this.renderWelcome }
                        </Route>
                        <Route path={getPath("dashboard")}>
                            { this.renderDashboard }
                        </Route>
                        <Redirect to={getPath("welcome")} />
                    </Switch>
                </Fragment>
        )(this.props.staticRouter.getPath)

    }
)
