import React, { Component } from "react"
import { bindActionCreators, compose } from "redux"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import { withStyles } from "@material-ui/core/styles"
import {
    CircularProgress, Dialog, DialogActions, withMobileDialog
} from "@material-ui/core"
import Button from "../../lib/mui-v1/Button"




// <Dialog> component
export default compose(
    withMobileDialog(),
    withStyles({
        backDrop: {
            backgroundColor: "rgba(0, 139, 82, 0.1)",
        },
    }),
    connect(
        (_state) => ({}),
        (dispatch) => bindActionCreators({}, dispatch)
    )
)(
    class extends Component {

        // ...
        static propTypes = {
            classes: PropTypes.object.isRequired,
            fullScreen: PropTypes.bool.isRequired,
            dialogVisible: PropTypes.bool.isRequired,
            onOk: PropTypes.func.isRequired,
            onCancel: PropTypes.func.isRequired,
        }


        // ...
        state = { open: false, }


        // ...
        handleOpen = () => {
            this.setState({ open: true, })
        }


        // ...
        handleClose = () => {
            this.setState({ open: false, })
        }


        // ...
        render = () => (
            ({
                classes, children, fullScreen, dialogVisible, onOk, onCancel,
                inProgress,
            }) =>

                <Dialog
                    fullScreen={fullScreen}
                    open={dialogVisible}
                    onClose={this.handleClose}
                    aria-labelledby="responsive-dialog-title"
                    disableBackdropClick
                    classes={{ root: classes.backDrop, }}
                >
                    {children}
                    <DialogActions>
                        <Button style={{ margin: "0.5em 0.75em 0.25em 0", }}
                            onClick={onOk} color="green"
                            disabled={inProgress}
                        >
                            {inProgress ? <CircularProgress
                                color="secondary" thickness={4} size={16}
                            /> : "Authenticate"}
                        </Button>
                        <Button style={{ margin: "0.5em 0.5em 0.25em 0", }}
                            onClick={onCancel} color="yellowDark"
                            disabled={inProgress}
                        >Cancel</Button>
                    </DialogActions>
                </Dialog>

        )(this.props)

    }
)
