import { homepage, name, version } from "../../../package.json"
import { timeUnit } from "@xcmats/js-toolbox"




// application name
export const appName = name




// application visible name
export const appVisName = "Stellar Fusion™"




// application version (taken from package.json)
export const appVersion = version




// DOM attach point
export const appRootDomId = "app"




// base URL
export const appBasePath = homepage




// base for REST API queries
export const apiBase = "https://api.stellarfox.net/"




// Session Storage application state key
export const ssAppStateKey = `Fusion.${appVersion}`




// Session Storage save throttling time - finest possible granularity (in ms)
export const ssSaveThrottlingTime = timeUnit.second




// default drawer width (when unfolded)
export const drawerWidth = 240




// Gravatar base URL
export const gravatarBase = "https://www.gravatar.com/avatar/"
