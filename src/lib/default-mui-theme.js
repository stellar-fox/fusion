import { createMuiTheme } from "@material-ui/core/styles"
import { rgb, rgba } from "./utils"




// Named color definitions.
const
    onyx                = rgb(49, 55, 65),
    outerSpace          = rgb(67, 73, 82),
    darkGunmetal        = rgb(29, 36, 46),
    arsenic             = rgb(56, 60, 69),
    eerieBlack          = rgb(15, 22, 33),
    silverChalice       = rgb(171, 173, 181),
    antiFlashWhite      = rgb(237, 242, 244),
    yellowDark          = rgb(254, 187, 0),
    yellowDarkHighlight = rgb(47, 41, 23),
    yellow              = rgb(255, 207, 68),
    yellowLight         = rgb(255, 221, 124),
    greenDark           = rgb(0, 139, 82),
    green               = rgb(30, 185, 128),
    greenHighlight      = rgb(6, 34, 24),
    greenLight          = rgb(88, 197, 150),
    blueDark            = rgb(0,151,172),
    blue                = rgb(114,222,255),
    blueLight           = rgb(172,235,245)



// ...
export default createMuiTheme({

    palette: {

        // These custom colors are defined here for convenience
        // but they are not part of a default theme.
        custom: {
            yellowDark,
            yellowDarkHighlight,
            yellow,
            yellowLight,

            greenDark,
            green,
            greenHighlight,
            greenLight,

            blueDark,
            blue,
            blueLight,

            arsenic,
            outerSpace,

        },

        common: {
            black: eerieBlack,
            white: antiFlashWhite,
        },

        primary: {
            light: onyx,
            main: darkGunmetal,
            dark: eerieBlack,
            contrastText: silverChalice,
        },

        secondary: {
            main: rgba(234, 235, 236, 0.87),
            faded: rgba(234, 235, 236, 0.54),
        },

        error: {
            main: rgb(211, 85, 102),
            light: rgb(255, 141, 153),
            dark: rgb(196, 28, 51),
        },

        background: {
            paper: onyx,
            default: darkGunmetal,
        },

        text: {
            primary: rgba(237, 242, 244, 0.87),
            secondary: rgba(237, 242, 244, 0.54),
        },

        divider: rgb(39, 45, 55),

    },




    typography: {

        display1: {
            fontSize: 11,
            fontFamily: "'Roboto Condensed', sans-serif",
        },

        display2: {
            fontSize: 9,
            fontFamily: "'Roboto Condensed', sans-serif",
            fontWeight: 100,
        },

        display3: {
            fontSize: 48,
            fontFamily: "Eczar, sans-serif",
        },

        display4: {
            fontSize: 34,
            fontFamily: "'Roboto Condensed', sans-serif",
        },

        headline: {
            fontSize: 24,
            fontFamily: "Eczar, sans-serif",
        },

        title: {
            fontSize: 20,
            fontFamily: "'Roboto Condensed', sans-serif",
            fontWeight: 200,
        },

        subheading: {
            fontSize: 16,
            fontFamily: "'Roboto Condensed', sans-serif",
        },

        body1: {
            fontSize: 16,
            fontFamily: "Eczar, sans-serif",
        },

        body2: {
            fontSize: 14,
            fontFamily: "'Roboto Condensed', sans-serif",
            fontWeight: 100,
        },

        button: {
            fontFamily: "'Roboto Condensed', sans-serif",
            fontWeight: 600,
        },

        caption: {
            fontSize: 12,
            fontFamily: "'Roboto Condensed', sans-serif",
        },
    },




    fusion: {

        appLogo: {
            display: "block",
            height: 40,
        },

        appLogoSm: {
            display: "block",
            height: 20,
        },

    },

})
