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
        color: theme.palette.text.primary,
    },

    underline: {
        "&:hover:before": {
            borderBottomColor: `${theme.palette.custom.outerSpace} !important`,
            borderBottomWidth: "1px !important",
        },
        "&:before": { borderBottomColor: theme.palette.primary.light },
        "&:after": { borderBottomColor: theme.palette.primary.light },
    },

    underlineLighter: {
        "&:hover:before": {
            borderBottomColor: `${theme.palette.custom.davysGray} !important`,
            borderBottomWidth: "1px !important",
        },
        "&:before": { borderBottomColor: theme.palette.custom.outerSpace },
        "&:after": { borderBottomColor: theme.palette.custom.outerSpace },
    },

    root: {
        fontFamily: "'Roboto Condensed', sans-serif",
    },

    focused: {
        "&$root": {
            color: theme.palette.custom.arsenic,
        },
    },

    focusedLighter: {
        "&$root": {
            color: theme.palette.custom.davysGray,
        },
    },

    error: {
        color: `${theme.palette.text.primary} !important`,
        fontFamily: "'Roboto Condensed', sans-serif",
        fontSize: "0.75em",
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
                autoFocus, classes, id, error, endAdornment, errorMessage,
                margin, label, type, onChange, fullWidth, autoComplete, lighter,
                value, required, errorClasses, defaultValue, min, max, step,
                shrink,
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
                            focused: lighter ? classes.focusedLighter :
                                classes.focused,
                            error: classes.focused,
                        }}
                        shrink={shrink}
                    >
                        {label}
                    </InputLabel>
                    <Input
                        id={id}
                        autoComplete={autoComplete}
                        autoFocus={autoFocus}
                        classes={{
                            underline: lighter ? classes.underlineLighter :
                                classes.underline,
                            input: classes.input,
                            error: errorClasses || classes.inputError,
                        }}
                        endAdornment={endAdornment}
                        type={type}
                        onChange={onChange}
                        fullWidth={fullWidth}
                        value={value}
                        required={required}
                        defaultValue={defaultValue}
                        inputProps={{
                            min,
                            max,
                            step,
                        }}
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
