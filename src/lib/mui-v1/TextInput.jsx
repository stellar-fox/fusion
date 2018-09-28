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
        "&:before": { borderBottomColor: theme.palette.primary.light, },
        "&:after": { borderBottomColor: theme.palette.primary.light, },
    },

    root: {
        fontFamily: "'Roboto Condensed', sans-serif",
    },

    focused: {
        "&$root": {
            color: theme.palette.custom.arsenic,
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
