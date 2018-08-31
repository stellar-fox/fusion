import React, { Component } from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
import { withStyles } from "@material-ui/core/styles"
import { Button } from "@material-ui/core"




// <CustomButton> component
export default withStyles((theme) => ({

    primary: {
        color: theme.palette.primary.contrastText,
        backgroundColor: theme.palette.background.button,
        "&:hover": {
            backgroundColor: theme.palette.primary.highlight,
        },
    },

    common: {
        borderRadius: "2px",
        paddingTop: "0.75rem",
        fontSize: "0.75rem",
        transition: "text-shadow 350ms ease-out, background-color 350ms ease",
        boxShadow: "0 3px 7px rgba(0, 0, 0, 0.3)",
        "&:last-child": {
            marginLeft: "0rem",
            marginRight: "0rem",
        },
    },

    disabled: {
        color: `${theme.lui.contextChrome.main} !important`,
        backgroundColor: `${theme.lui.contextChrome.faded} !important`,
    },

}))(
    class extends Component {

        // ...
        static propTypes = {
            classes: PropTypes.object.isRequired,
        }


        // ...
        render = () => (
            ({ children, classes, color, disabled, fullWidth, onClick, }) =>
                <Button
                    variant="raised"
                    className={
                        classNames(
                            disabled ? classes.disabled : classes[color],
                            classes.common,
                        )
                    }
                    onClick={onClick}
                    disabled={disabled}
                    fullWidth={fullWidth}

                >
                    { children ? children : "Button" }
                </Button>
        )(this.props)

    }
)
