import React from "react"
import { Provider } from "react-redux"
import {
    ConnectedSwitch as Switch,
    FusionRouter as Router,
} from "../FusionRouter"
import {
    Redirect,
    Route,
} from "react-router-dom"
import * as env from "./env"
import { MuiThemeProvider } from "@material-ui/core/styles"
import CssBaseline from "@material-ui/core/CssBaseline"
import defaultMuiTheme from "../../lib/default-mui-theme"
import Layout from "../Layout"
import "./index.css"




// <Fusion> -- application's main component
export default ({ history, store }) =>
    <Provider store={store}>
        <Router history={history}>
            <MuiThemeProvider theme={defaultMuiTheme}>
                <CssBaseline />
                <Switch>
                    <Route path={env.appBasePath}>
                        { (routeProps) => <Layout {...routeProps} /> }
                    </Route>
                    <Redirect to={env.appBasePath} />
                </Switch>
            </MuiThemeProvider>
        </Router>
    </Provider>




// ...
export { env }
