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
import Signup from "../Signup"
import PasswordReset from "../PasswordReset"
import FirebaseActions from "../FirebaseActions"
import { Typography } from "@material-ui/core"
import queryString from "query-string"



// <Layout> component
export default compose(
    withStaticRouter,
    connect(
        // map state to props.
        (state) => ({
            authenticated: toBool(state.Auth.uid),
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
                "signup": this.rr("signup/"),
                "actions": this.rr("actions/"),
                "reset": this.rr("reset/"),
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
        renderSignup = (routeProps) =>
            !this.props.authenticated ?
                <Signup {...routeProps} /> :
                <Redirect to={this.props.staticRouter.getPath("dashboard")} />


        // ...
        renderReset = (routeProps) => <PasswordReset {...routeProps} />


        // ...
        renderFirebaseActions = (routeProps) => {
            const qs = queryString.parse(
                this.props.location.search,
                { ignoreQueryPrefix: true, }
            )
            return qs.mode ?
                <FirebaseActions {...routeProps} /> :
                this.props.authenticated ?
                    <this.state.Dashboard {...routeProps} /> :
                    <Redirect to={this.props.staticRouter.getPath("welcome")} />
        }


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
                        <Route exact path={getPath("reset")}>
                            {this.renderReset}
                        </Route>
                        <Route exact path={getPath("signup")}>
                            {this.renderSignup}
                        </Route>
                        <Route exact path={getPath("actions")}>
                            {this.renderFirebaseActions}
                        </Route>
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
