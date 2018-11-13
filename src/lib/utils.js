import React, { Fragment } from "react"
import {
    access,
    devEnv,
    string,
    type,
    objectMap,
} from "@xcmats/js-toolbox"




// ...
export const isAdmin = (role) => role === "ROLE_ADMIN"




// ...
export const isWriter = (role) => role === "ROLE_RW"




// ...
export const isReader = (role) => role === "ROLE_RO"




// asynchronously load libraries (used in dev. environment)
export const dynamicImportLibs = async () => {
    let [
        axios, base64, jss, lodash,
        mui, redshift, redux, stellar, toolbox, utils,
    ] = await Promise.all([
        import("axios"),
        import("js-base64"),
        import("jss"),
        import("lodash"),
        import("@material-ui/core"),
        import("@stellar-fox/redshift"),
        import("redux"),
        import("stellar-sdk"),
        import("@xcmats/js-toolbox"),
        import("./utils"),
    ])
    return {
        axios,
        Base64: base64.Base64,
        jss, lodash, mui, redshift, redux,
        stellar, toolbox, utils,
    }
}




// asynchronously load reducers (used in dev. environment)
export const dynamicImportReducers = async () => {
    let [
        Auth, Fusion,
        FusionRouter, Snacky, UserManagement,
    ] = await Promise.all([
        import("../redux/Auth"),
        import("../redux/Fusion"),
        import("../redux/FusionRouter"),
        import("../redux/Snacky"),
        import("../redux/UserManagement"),
    ])
    return {
        Auth,
        Application: Fusion,
        Router: FusionRouter,
        Snacky,
        UserManagement,
    }
}




// emojis!
export const emojis = {

    "bomb": "💣",
    "boom": "💥",
    "cancel": "❌",

}




// commonly-used HTML entities
export const htmlEntities = {

    // https://www.fileformat.info/info/unicode/char/20/index.htm
    //
    // Space: () => React.createElement(
    //     Fragment, null, String.fromCharCode(0x20)
    // ),
    Space: () => <Fragment>{" "}</Fragment>,

    // https://www.fileformat.info/info/unicode/char/a0/index.htm
    //
    // Nbsp: () => React.createElement(
    //     Fragment, null, String.fromCharCode(0xA0)
    // ),
    Nbsp: () => <Fragment>&nbsp;</Fragment>,

}




// emoji components (built on the 'emojis' object base)
export const emoji = objectMap(emojis,
    ([k, v]) => [
        string.capitalize(k),
        () => React.createElement(Fragment, null, v),
    ]
)




// <Null> component
export const Null = () => null




// little helper for JSS urls
export const url = (x) => string.wrap(x, "url(", ")")




// little helper for JSS colors
export const rgba = (r, g, b, a) =>
    string.wrap([r, g, b, a].join(", "), "rgba(", ")")




// another little helper for JSS colors
export const rgb = (r, g, b) =>
    string.wrap([r, g, b].join(", "), "rgb(", ")")




// helper extracting 'authToken' from redux state
export const authToken = (getState) => access(
    getState(),
    ["Auth", "authToken"],
    string.empty()
)




// dev. only - shambhala integration testing
export const shambhalaTesting = devEnv() ? {
    init: async () => {
        let
            logger = console,
            context = {},
            {
                Shambhala,
                shambhalaTestingModule,
            } = await import("./shambhala.client"),
            testing = shambhalaTestingModule(logger, context)

        // expose to dev. namespace
        if (type.isObject(window.sf)) {
            window.sf.Shambhala = Shambhala
            window.sf.context = context
            window.sf.testing = testing
        }

        // prepare test environment
        await testing.setEnv()
        await testing.instantiate(
            "https://secrets.localhost/shambhala/shambhala.html"
        )
        await context.shambhala._openShambhala()

        // instruct what to do next
        logger.info(
            "Try one of these:\n",
            Object.keys(testing.scenario).map(
                (n) => `sf.testing.scenario.${n}()`
            ).join("\n ")
        )

        return { Shambhala, context, testing }
    },
} : {
    init: () => {
        throw new Error("Sorry. Not in the production.")
    },
}
