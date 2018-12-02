import React, { Component } from "react"
import { bindActionCreators, compose } from "redux"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import { withStyles } from "@material-ui/core/styles"
import {
    Dialog, DialogActions, DialogContent, DialogTitle,
    Typography, withMobileDialog
} from "@material-ui/core"
import { action as KeysActions} from "../../redux/Keys"
import {
    cancel,
    obtainAccountId,
    generateSignedMultisigTx,
    generateSigningKeys,
    setErrorMessage,
    setProgressMessage,
    setSigningMethod,
} from "../../actions/onboarding"
import {
    addSigningMethodToAccount,
    fundAccount,
    getLatestAccountState,
    submitTransaction,
} from "../../actions/stellarAccount"
import Button from "../../lib/mui-v1/Button"
import { delay, string } from "@xcmats/js-toolbox"




// <ModalSignupPure> component
export default compose(
    withMobileDialog(),
    withStyles((theme) => ({
        paper: {
            backgroundColor: theme.palette.custom.blueDark,
        },
    })),
    connect(
        (state) => ({
            open: state.Keys.ModalSignupPure.showing,
            networkPassphrase: state.Keys.networkPassphrase,
            accountId: state.Keys.accountId,
        }),
        (dispatch) => bindActionCreators({
            cancel,
            hideSpinner: KeysActions.hideSpinner,
            showSpinner: KeysActions.showSpinner,
            hideSignupPureModal: KeysActions.hideSignupPureModal,
            showAwaitPureModal: KeysActions.showAwaitPureModal,
            hideAwaitPureModal: KeysActions.hideAwaitPureModal,
            fundAccount,
            obtainAccountId,
            generateSigningKeys,
            setErrorMessage,
            setProgressMessage,
            setSigningMethod,
            getLatestAccountState,
            addSigningMethodToAccount,
            generateSignedMultisigTx,
            submitTransaction,
        }, dispatch)
    )
)(
    class extends Component {

        // ...
        static propTypes = {
            classes: PropTypes.object.isRequired,
        }


        // ...
        handleYes = async () => {
            try {

                await this.props.setProgressMessage(string.empty())
                await this.props.setErrorMessage(string.empty())


                await this.props.hideSignupPureModal()
                await this.props.showAwaitPureModal()


                await this.props.showSpinner()
                await this.props.setProgressMessage(
                    "ACTION REQUIRED. Check pop-up window."
                )
                await this.props.obtainAccountId()


                await this.props.setProgressMessage(
                    "Generating signatures ..."
                )
                await this.props.generateSigningKeys()


                await this.props.setProgressMessage(
                    "Funding account ..."
                )
                await this.props.fundAccount()


                await this.props.getLatestAccountState()
                await this.props.addSigningMethodToAccount()


                await this.props.setProgressMessage(
                    "Creating additional signatures ..."
                )
                const signedTx = await this.props.generateSignedMultisigTx()
                await this.props.submitTransaction(signedTx)


                await this.props.hideSpinner()
                await this.props.setProgressMessage(
                    "Complete."
                )
                await delay(1500)
                await this.props.hideAwaitPureModal()

            } catch (error) {
                await this.props.hideSpinner()
                await this.props.setProgressMessage(string.empty())
                await this.props.setErrorMessage(error.message)
            }
        }


        // ...
        handleNo = () => this.props.cancel()


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
                        Shambhala Pure - Welcome!
                    </DialogTitle>
                    <DialogContent>
                        <Typography variant="subtitle1">
                            You will associate this device with your bank.
                            It will provide a convenice to manage your funds
                            and sign transactions with a PIN. Suitable
                            for novice users.
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleYes} color="green"
                            autoFocus
                        >
                            Proceed
                        </Button>
                        <Button style={{margin: "0 3px 0 10px"}}
                            onClick={this.handleNo} color="yellow"
                        >
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
        )(this.props)

    }
)
