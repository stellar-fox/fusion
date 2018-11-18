import React, { Component } from "react"
import { bindActionCreators, compose } from "redux"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import { withStyles } from "@material-ui/core/styles"
import {
    Dialog, DialogActions, DialogContent, DialogTitle,
    Typography, withMobileDialog
} from "@material-ui/core"
import Button from "../../lib/mui-v1/Button"
import { string } from "@xcmats/js-toolbox"
import { action as KeysActions } from "../../redux/Keys"
import {
    setSigningMethod
} from "../../actions/onboarding"


// <ModalSignupPure> component
export default compose(
    withMobileDialog(),
    withStyles((theme) => ({
        paper: {
            backgroundColor: theme.palette.custom.greenDark,
        },
    })),
    connect(
        (state) => ({
            open: state.Keys.ModalSignupLedger.showing,
        }),
        (dispatch) => bindActionCreators({
            hideSignupLedgerModal: KeysActions.hideSignupLedgerModal,
            setSigningMethod,
        }, dispatch)
    )
)(
    class extends Component {

        // ...
        static propTypes = {
            classes: PropTypes.object.isRequired,
        }


        // ...
        state = {
            progressMessage: string.empty(),
        }

        // ...
        handleYes = async () => {
            this.props.showSignupLedgerModal()
        }


        // ...
        handleNo = () => {
            this.props.hideSignupLedgerModal()
            this.props.setSigningMethod(null)
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
                        Shambhala Ledger - Welcome!
                    </DialogTitle>
                    <DialogContent>
                        <Typography variant="h6">
                            We will assiciate your <span className="cursive">
                            Ledger Nano S</span> device's public key.
                            Make sure your device is connected and Stellar
                            application selected.
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleYes} color="green"
                            autoFocus
                        >
                            Proceed
                        </Button>
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
