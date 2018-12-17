import React, { Component } from "react"
import { bindActionCreators, compose } from "redux"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import { withStyles } from "@material-ui/core/styles"
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    withMobileDialog
} from "@material-ui/core"
import Button from "../../lib/mui-v1/Button"
import {
    closeShambhala,
    resetOnboardingState,
} from "../../actions/onboarding"
import Awaiter from "../Awaiter"
import { action as AwaiterActions } from "../../redux/Awaiter"




// <ModalAwaitLedger> component
export default compose(
    withMobileDialog(),
    withStyles((theme) => ({
        paper: {
            backgroundColor: theme.palette.custom.greenDark,
        },
    })),
    connect(
        (state) => ({
            open: state.Keys.ModalAwaitLedger.showing,
        }),
        (dispatch) => bindActionCreators({
            closeShambhala,
            resetOnboardingState,
            resetAwaiterState: AwaiterActions.resetState,
        }, dispatch)
    )
)(
    class extends Component {

        // ...
        static propTypes = {
            classes: PropTypes.object.isRequired,
        }


        // ...
        handleNo = () => {
            this.props.closeShambhala()
            this.props.resetOnboardingState()
            this.props.resetAwaiterState()
        }


        // ...
        render = () => (
            ({ classes, fullScreen, open }) =>
                <Dialog
                    fullScreen={fullScreen}
                    open={open}
                    aria-labelledby="responsive-dialog-title"
                    classes={{ paper: classes.paper }}
                >
                    <DialogTitle id="responsive-dialog-title">
                        Shambhala Ledger: Onboarding
                    </DialogTitle>
                    <DialogContent>
                        <div className="flex-box-col items-centered content-centered">
                            <Awaiter />
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button style={{ margin: "0 3px 0 10px" }}
                            onClick={this.handleNo} color="yellow"
                        >
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
        )(this.props)

    }
)
