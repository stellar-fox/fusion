import React from "react"
import ReactDOM from "react-dom"
import { unregister } from "./lib/caching-service-worker"
import Fusion, { env } from "./components/Fusion"
import { createBrowserHistory } from "history"
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
import { throttle } from "./lib/utils"
import { routerMiddleware } from "react-router-redux"
import {
    loadState,
    saveState,
} from "./lib/state-persistence"
import reducers from "./redux"
import {
    devEnv,
    getProcess,
    isObject,
    to_,
} from "@xcmats/js-toolbox"
import {
    dynamicImportLibs,
    dynamicImportReducers,
} from "./lib/utils"
import {
    setDataLoading,
    setScreenDimensions
} from "./thunks/main"
import "typeface-eczar"
import "typeface-roboto-condensed"



window.addEventListener("load", () => {

    
    // browser history
    const history = createBrowserHistory()

    // store with router-redux integration and redux-devtools-extension
    const store = (() => {
        let
            composeWithDevTools = !devEnv() ?
                composeWithDevTools_prod : composeWithDevTools_dev,
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


    // add available window-dimensions event listener
    // (needed for some hacky components)
    window.addEventListener(
        "resize",
        () => store.dispatch(setScreenDimensions())
    )

    // surface page loading spinner while everything else finishes loading
    store.dispatch(setDataLoading())


    // expose 'sf' dev. namespace only in dev. environment
    if (devEnv() && isObject(window)) {
        (async () => {
            window.sf = {
                env, history, store, React,
                dispatch: store.dispatch,
                ...await dynamicImportLibs(),
                process: getProcess(),
                r: await dynamicImportReducers(),
            }
            window.to_ = to_
        })()
    }



    // render application's root into the DOM
    ReactDOM.render(
        React.createElement(Fusion, { history, store }),
        document.getElementById(env.appRootDomId)
    )



    // ...
    unregister()
})
