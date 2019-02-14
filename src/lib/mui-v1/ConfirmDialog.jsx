import React, { Component } from "react"
import { bindActionCreators, compose } from "redux"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import {
    CircularProgress,
    Dialog,
    DialogActions,
    withMobileDialog,
} from "@material-ui/core"
import Button from "../../lib/mui-v1/Button"




// <Dialog> component
export default compose(
    withMobileDialog(),
    connect(
        (_state) => ({}),
        (dispatch) => bindActionCreators({}, dispatch)
    )
)(
    class extends Component {

        // ...
        static propTypes = {
            fullScreen: PropTypes.bool.isRequired,
            dialogVisible: PropTypes.bool.isRequired,
            inProgress: PropTypes.bool.isRequired,
            onOk: PropTypes.func.isRequired,
            onCancel: PropTypes.func.isRequired,
        }


        // ...
        render = () => (
            ({
                children, fullScreen, dialogVisible, onOk, onCancel,
                inProgress, okButtonText,
            }) =>

                <Dialog
                    fullScreen={fullScreen}
                    open={dialogVisible}
                    aria-labelledby="responsive-dialog-title"
                    disableBackdropClick
                >
                    {children}
                    <DialogActions>
                        <Button style={{ margin: "0.5em 0.75em 0.25em 0" }}
                            onClick={onOk} color="green"
                            disabled={inProgress}
                        >
                            {inProgress ? <CircularProgress
                                color="secondary" thickness={4} size={20}
                            /> : okButtonText}
                        </Button>
                        <Button style={{ margin: "0.5em 0.5em 0.25em 0" }}
                            onClick={onCancel} color="yellowDark"
                            disabled={inProgress}
                        >Cancel</Button>
                    </DialogActions>
                </Dialog>

        )(this.props)

    }
)
