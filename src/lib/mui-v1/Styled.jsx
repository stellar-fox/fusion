import React from "react"
import classNames from "classnames"
import PropTypes from "prop-types"
import { withStyles } from "@material-ui/core/styles"

export const styled = (Component) =>
    (style, options) => {
        const StyledComponent = (props) => {
            const { classes, className, ...other } = props
            return <Component className={
                classNames(classes.root, className)
            } {...other}
            />
        }
        StyledComponent.propTypes = {
            classes: PropTypes.object.isRequired,
            className: PropTypes.string,
        }
        const styles = typeof style === "function" ?
            theme => ({ root: style(theme), }) : { root: style, }
        return withStyles(styles, options)(StyledComponent)
    }
