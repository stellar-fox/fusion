import React, { Component } from "react"
import PropTypes from "prop-types"
import { withStyles } from "@material-ui/core/styles"
import {
    Input,
    InputLabel,
    FormControl,
    FormHelperText,
} from "@material-ui/core"




// <InputField> component
export default withStyles((theme) => ({

    input: {
        color: theme.palette.secondary.main,
    },

    underline: {
        "&:hover:before": {
            borderBottomColor: `${theme.lui.canvas.faded} !important`,
            borderBottomWidth: "1px !important",
        },
        "&:before": { borderBottomColor: theme.lui.canvas.faded, },
        "&:after": { borderBottomColor: theme.lui.canvas.faded, },
    },

    root: { color: theme.lui.brandMembrane.label, },

    focused: {
        "&$root": {
            color: theme.palette.secondary.dark,
        },
    },

    error: {
        color: `${theme.palette.error.light} !important`,
    },

    inputError: {
        "&:hover:before": {
            borderBottomColor: `${theme.palette.error.dark} !important`,
            borderBottomWidth: "1px !important",
        },
        "&:before": { borderBottomColor:
            `${theme.palette.error.dark} !important`,
        },
        "&:after": { borderBottomColor:
            `${theme.palette.error.dark} !important`,
        },
    },

}))(
    class extends Component {

        // ...
        static propTypes = {
            classes: PropTypes.object.isRequired,
        }


        // ...
        render = () => (
            ({
                classes, id, error, errorMessage, margin,
                label, type, onChange, fullWidth, autoComplete,
            }) =>
                <FormControl
                    error={error}
                    fullWidth={fullWidth}
                    className={classes.formControl}
                    margin={margin || "dense"}
                >
                    <InputLabel
                        FormLabelClasses={{
                            root: classes.root,
                            focused: classes.focused,
                            error: classes.focused,
                        }}
                    >
                        {label}
                    </InputLabel>
                    <Input
                        id={id}
                        autoComplete={autoComplete}
                        classes={{
                            underline: classes.underline,
                            input: classes.input,
                            error: classes.inputError,
                        }}
                        type={type}
                        onChange={onChange}
                        fullWidth={fullWidth}
                    />
                    <FormHelperText
                        classes={{
                            error: classes.error,
                        }}
                        id="name-error-text"
                    >
                        {errorMessage}
                    </FormHelperText>
                </FormControl>
        )(this.props)

    }
)
