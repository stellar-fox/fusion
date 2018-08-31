import React, { Component } from "react"
import PropTypes from "prop-types"
import { withStyles } from "@material-ui/core/styles"
import { Snackbar } from "@material-ui/core"




// <CustomSnackbar> component
export default withStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.brand,
    },
}))(
    class extends Component {

        // ...
        static propTypes = {
            classes: PropTypes.object.isRequired,
        }


        // ...
        render = () => (
            ({ classes, onClose, message, open, }) =>
                <Snackbar
                    open={open}
                    autoHideDuration={2300}
                    onClose={onClose}
                    ContentProps={{
                        "aria-describedby": "message-id",
                        classes: { root: classes.root, },
                    }}
                    message={<span id="message-id">{message}</span>}
                    transitionDuration={{ enter: 300, exit: 200, }}
                    disableWindowBlurListener={true}
                />
        )(this.props)

    }
)
