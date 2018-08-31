import React from "react"
import ReactDOM from "react-dom"
import { unregister } from "./lib/caching-service-worker"

import Fusion, { env } from "./components/Fusion"




// render application's root into the DOM
ReactDOM.render(
    React.createElement(Fusion),
    document.getElementById(env.appRootDomId)
)




// ...
unregister()
