import React, { Fragment } from "react"
import {
    devEnv,
    string,
    struct,
    type,
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

        axios, jss, lodash, mui, cryptops,
        redshift, redux, stellar, toolbox, utils,

        // actions
        onboarding,

        // logic
        ledgerhq,
        transaction,

    ] = await Promise.all([
        import("axios"),
        import("jss"),
        import("lodash"),
        import("@material-ui/core"),
        import("@stellar-fox/cryptops"),
        import("@stellar-fox/redshift"),
        import("redux"),
        import("stellar-sdk"),
        import("@xcmats/js-toolbox"),
        import("./utils"),

        // actions
        import("../actions/onboarding"),

        // logic
        import("../lib/logic/ledgerhq"),
        import("../lib/logic/transaction"),
    ])
    return {
        axios,
        jss, lodash, mui, cryptops, redshift,
        redux, stellar, toolbox, utils,

        // actions
        actions: {
            onboarding,
        },

        // logic
        logic: {
            ledgerhq,
            transaction,
        },
    }
}




// asynchronously load reducers (used in dev. environment)
export const dynamicImportReducers = async () => {
    let [
        Auth, App, Router, Keys,
        Snacky, UserManagement,
    ] = await Promise.all([
        import("../redux/Auth"),
        import("../redux/Fusion"),
        import("../redux/FusionRouter"),
        import("../redux/Keys"),
        import("../redux/Snacky"),
        import("../redux/UserManagement"),
    ])
    return {
        Auth,
        App,
        Router,
        Keys,
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
export const emoji = struct.objectMap(emojis,
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
export const authToken = (getState) => struct.access(
    getState(), ["Auth", "authToken"], string.empty()
)




// dev. only - shambhala integration testing
export const shambhalaTesting = devEnv() ? {
    init: async () => {
        let
            logger = console,
            context = {},
            {
                inspectTSP,
                signTSP,
                Shambhala,
                shambhalaTestingModule,
            } = await import("./shambhala.client"),
            testing = shambhalaTestingModule(logger, context)

        // expose to dev. namespace
        if (type.isObject(window.sf)) {
            window.sf.Shambhala = Shambhala
            window.sf.context = context
            window.sf.testing = testing
            window.sf.txops = { inspectTSP, signTSP }
        }

        // prepare test environment
        await testing.setEnv()
        await testing.instantiate(
            "https://secrets.localhost/shambhala/shambhala.html"
        )
        await context.shambhala._openShambhala()

        // instruct what to do next
        logger.info(
            `Try one of these:${string.nl()}`,
            Object.keys(testing.scenario).map(
                (n) => `sf.testing.scenario.${n}()`
            ).join(`${string.nl()}${string.space()}`)
        )

        return { Shambhala, context, testing }
    },
} : {
    init: () => {
        throw new Error("Sorry. Not in the production.")
    },
}
