import React, { Component } from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
import { withStyles } from "@material-ui/core/styles"
import { Button } from "@material-ui/core"




// <CustomButton> component
export default withStyles((theme) => ({

    primary: {
        color: theme.palette.primary.light,
    },

    common: {
        backgroundColor: theme.palette.primary.dark,
        "&:hover": {
            backgroundColor: theme.palette.primary.main,
        },
        borderRadius: "2px",
        fontSize: "0.75rem",
        transition: "text-shadow 350ms ease-out, background-color 350ms ease",
        boxShadow: "0 3px 7px rgba(0, 0, 0, 0.3)",
        "&:last-child": {
            marginLeft: "0rem",
            marginRight: "0rem",
        },
    },

    disabled: {
        color: `${theme.palette.custom.arsenic} !important`,
        backgroundColor: `${theme.palette.primary.main} !important`,
        opacity: "0.5",
    },

    yellowLight: {
        color: theme.palette.custom.yellowLight,
    },

    yellow: {
        color: theme.palette.custom.yellow,
    },

    yellowDark: {
        color: theme.palette.custom.yellowDark,
        "&:hover": {
            backgroundColor: theme.palette.custom.yellowDarkHighlight,
        },
    },

    greenDark: {
        color: theme.palette.custom.greenDark,
    },

    green: {
        color: theme.palette.custom.green,
        "&:hover": {
            backgroundColor: theme.palette.custom.greenHighlight,
        },
    },

    greenLight: {
        color: theme.palette.custom.greenLight,
    },

}))(
    class extends Component {

        // ...
        static propTypes = {
            classes: PropTypes.object.isRequired,
        }


        // ...
        render = () => (
            ({ autoFocus, children, classes, color, disabled, fullWidth, onClick, variant, style }) =>
                <Button
                    variant={variant || "contained"}
                    className={
                        classNames(
                            disabled ? classes.disabled : classes[color],
                            classes.common,
                        )
                    }
                    onClick={onClick}
                    disabled={disabled}
                    fullWidth={fullWidth}
                    autoFocus={autoFocus}
                    style={style}
                >
                    { children ? children : "Button" }
                </Button>
        )(this.props)

    }
)
