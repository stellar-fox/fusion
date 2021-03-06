import { createMuiTheme } from "@material-ui/core/styles"
import { rgb, rgba } from "./utils"




// Named color definitions.
const
    // --------------- GRAYS ---------------
    darkGunmetal        = rgb(29, 36, 46),
    eerieBlack          = rgb(15, 22, 33),
    arsenic             = rgb(56, 60, 69),
    onyx                = rgb(49, 55, 65),
    outerSpace          = rgb(67, 73, 82),
    davysGray           = rgb(86,87,91),

    orange              = rgb(255,104,89),
    orangeLight         = rgb(249,165,161),


    silverChalice       = rgb(171, 173, 181),
    spanishGray         = rgb(152,155,160),
    antiFlashWhite      = rgb(237, 242, 244),
    yellowDark          = rgb(254, 187, 0),
    yellowDarkHighlight = rgb(35, 30, 17),
    yellow              = rgb(255, 207, 68),
    yellowLight         = rgb(255, 221, 124),
    greenDark           = rgb(0, 139, 82),
    green               = rgb(30, 185, 128),
    greenHighlight      = rgb(6, 34, 24),
    greenLight          = rgb(88, 197, 150),
    blueDark            = rgb(0,151,172),
    blue                = rgb(114,222,255),
    blueLight           = rgb(172,235,245),
    purpleDark          = rgb(177,93,255),
    purple              = rgb(191,122,255),
    purpleLight         = rgb(212,166,255)



// ...
export default createMuiTheme({

    palette: {

        // These custom colors are defined here for convenience
        // but they are not part of a default theme.
        custom: {

            darkGunmetal,
            eerieBlack,
            arsenic,
            onyx,
            outerSpace,
            davysGray,

            orange,
            orangeLight,

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

            silverChalice,
            spanishGray,
            antiFlashWhite,

            purpleDark,
            purple,
            purpleLight,

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
            contrastText: eerieBlack,
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

        useNextVariants: true,

        h1: {
            fontSize: 96,
            fontWeight: 100,
            fontFamily: "'Roboto Condensed', sans-serif",
        },

        h2: {
            fontSize: 60,
            fontWeight: 100,
            fontFamily: "'Roboto Condensed', sans-serif",
        },

        h3: {
            fontSize: 48,
            fontFamily: "Eczar, sans-serif",
        },

        h4: {
            fontSize: 34,
            fontFamily: "'Roboto Condensed', sans-serif",
        },

        h5: {
            fontSize: 24,
            fontFamily: "'Roboto Condensed', sans-serif",
        },

        h6: {
            fontSize: 20,
            fontWeight: 200,
            fontFamily: "'Roboto Condensed', sans-serif",
        },

        subtitle1: {
            fontSize: 16,
            fontFamily: "'Roboto Condensed', sans-serif",
        },

        subtitle2: {
            fontSize: 14,
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
            fontSize: 14,
            fontFamily: "'Roboto Condensed', sans-serif",
            fontWeight: 600,
            textTransform: "uppercase",
        },

        caption: {
            fontSize: 12,
            fontFamily: "'Roboto Condensed', sans-serif",
        },

        overline: {
            fontSize: 10,
            fontFamily: "'Roboto Condensed', sans-serif",
            textTransform: "uppercase",
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
