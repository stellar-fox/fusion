import React from "react"

import { Provider } from "react-redux"
import {
    applyMiddleware,
    createStore,
    combineReducers,
} from "redux"
import thunk from "redux-thunk"
import {
    composeWithDevTools as composeWithDevTools_prod
} from "redux-devtools-extension/developmentOnly"
import {
    composeWithDevTools as composeWithDevTools_dev
} from "redux-devtools-extension"

import { isObject } from "@xcmats/js-toolbox"

import throttle from "lodash/throttle"
import createHistory from "history/createBrowserHistory"
import {
    ConnectedSwitch as Switch,
    FusionRouter as Router,
} from "../FusionRouter"
import {
    Redirect,
    Route,
} from "react-router-dom"
import { routerMiddleware } from "react-router-redux"

import {
    loadState,
    saveState,
} from "../../lib/state-persistence"
import reducers from "../../redux"
import {
    devEnv,
    dynamicImportLibs,
    dynamicImportReducers,
} from "../../lib/utils"
import * as env from "./env"

import { MuiThemeProvider } from "@material-ui/core/styles"
import CssBaseline from "@material-ui/core/CssBaseline"
import defaultMuiTheme from "../../lib/default-mui-theme"

import Layout from "../Layout"

import "typeface-eczar"
import "typeface-roboto-condensed"
import "./index.css"




// browser history
export const history = createHistory({ /* basename: env.appBasePath, */ })




// store with router-redux integration and redux-devtools-extension
export const store = (() => {
    let
        composeWithDevTools = !devEnv()  ?
            composeWithDevTools_prod  :  composeWithDevTools_dev,
        s =
            createStore(
                combineReducers(reducers),
                loadState(),
                composeWithDevTools(
                    applyMiddleware(
                        thunk,
                        routerMiddleware(history)
                    )
                )
            )

    // save state in session storage in min. 1 sec. intervals
    s.subscribe(
        throttle(
            () => saveState(s.getState()),
            env.ssSaveThrottlingTime
        )
    )

    return s
})()




// <Fusion> -- application's main component
export default () =>
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




// expose 'fusion' dev. namespace only in dev. environment
if (devEnv()  &&  isObject(window)) {
    (async () => { window.fusion = {
        env, history, store, React,
        dispatch: store.dispatch,
        ...await dynamicImportLibs(),
        process, // eslint-disable-line
        r: await dynamicImportReducers(),
    }})()
}




// ...
export { env }
