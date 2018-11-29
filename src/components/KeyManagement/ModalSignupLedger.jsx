import React, { Component } from "react"
import { bindActionCreators, compose } from "redux"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import { withStyles } from "@material-ui/core/styles"
import {
    Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel,
    Switch, Typography, withMobileDialog
} from "@material-ui/core"
import Button from "../../lib/mui-v1/Button"
import TextInput from "../../lib/mui-v1/TextInput"
import { action as KeysActions } from "../../redux/Keys"
import {
    obtainAccountId, generateMultisigTx, generateSigningKeys, setSigningMethod,
    setErrorMessage, setProgressMessage
} from "../../actions/onboarding"
import {
    addSigningMethodToAccount, getLatestAccountState, submitTransaction
} from "../../actions/stellarAccount"
import {
    setUseDefaultAccount, setAccount, signTxWithLedgerHQ
} from "../../actions/ledgering"
import { delay, string, type } from "@xcmats/js-toolbox"
import { Motion, presets, spring } from "react-motion"




// <ModalSignupPure> component
export default compose(
    withMobileDialog(),
    withStyles((theme) => ({
        inputError: {
            "&:hover:before": {
                borderBottomColor: `${theme.palette.error.light} !important`,
                borderBottomWidth: "1px !important",
            },
            "&:before": {
                borderBottomColor:
                    `${theme.palette.error.light} !important`,
            },
            "&:after": {
                borderBottomColor:
                    `${theme.palette.error.light} !important`,
            },
        },
        paper: {
            backgroundColor: theme.palette.custom.greenDark,
        },
    })),
    connect(
        (state) => ({
            open: state.Keys.ModalSignupLedger.showing,
            account: state.LedgerHQ.account,
            useDefaultAccount: state.LedgerHQ.useDefaultAccount,
            error: state.LedgerHQ.error,
            errorMessage: state.LedgerHQ.errorMessage,
        }),
        (dispatch) => bindActionCreators({
            hideSignupLedgerModal: KeysActions.hideSignupLedgerModal,
            showAwaitLedgerModal: KeysActions.showAwaitLedgerModal,
            hideAwaitLedgerModal: KeysActions.hideAwaitLedgerModal,
            showSpinner: KeysActions.showSpinner,
            hideSpinner: KeysActions.hideSpinner,
            setAccount,
            setSigningMethod,
            setErrorMessage,
            setProgressMessage,
            setUseDefaultAccount,
            getLatestAccountState,
            addSigningMethodToAccount,
            generateMultisigTx,
            obtainAccountId,
            generateSigningKeys,
            signTxWithLedgerHQ,
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

                await this.props.hideSignupLedgerModal()
                await this.props.showAwaitLedgerModal()

                await this.props.showSpinner()

                await this.props.setProgressMessage(
                    "Querying signing service ..."
                )
                await this.props.obtainAccountId()

                await this.props.setProgressMessage(
                    "ACTION REQUIRED. Check pop-up window."
                )

                await this.props.generateSigningKeys()


                await this.props.setProgressMessage(
                    "Fetching current account data ..."
                )
                await this.props.getLatestAccountState()
                await this.props.addSigningMethodToAccount()

                await this.props.setProgressMessage(
                    "ACTION REQUIRED. Check your signing device."
                )
                const tx = await this.props.generateMultisigTx()
                const signedTx = await this.props.signTxWithLedgerHQ(tx)

                await this.props.setProgressMessage(
                    "Submitting ..."
                )
                await this.props.submitTransaction(signedTx)

                await this.props.hideSpinner()

                await this.props.setProgressMessage("Complete.")

                await delay(1500)
                await this.props.hideAwaitLedgerModal()
            } catch (error) {
                await this.props.hideSpinner()
                await this.props.setProgressMessage(string.empty())
                await this.props.setErrorMessage(error.message)
            }

        }


        // ...
        handleNo = () => {
            this.props.hideSignupLedgerModal()
            this.props.setSigningMethod(null)
        }


        // ...
        handleSwitch = () => (event) =>
            this.props.setUseDefaultAccount(event.target.checked)


        // ...
        handleChange = () => (event) =>
            this.props.setAccount(event.target.value)


        // ...
        render = () => (
            ({
                classes, error, errorMessage, fullScreen, open,
                useDefaultAccount,
            }) =>
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
                        <div className="m-t flex-box-row">
                            <FormControlLabel control={
                                <Switch
                                    checked={type.toBool(useDefaultAccount)}
                                    onChange={this.handleSwitch()}
                                />
                            } label="Use Default Account"
                            />
                        </div>


                        <Motion defaultStyle={{ opacity: 0 }}
                            style={{
                                opacity: spring(
                                    useDefaultAccount ? 0 : 1,
                                    presets.gentle
                                ),
                            }}
                        >
                            {value =>
                                <div style={{ opacity: value.opacity }}
                                    className="flex-box-row"
                                >
                                    <TextInput
                                        label="Account"
                                        defaultValue={this.props.account}
                                        onChange={this.handleChange()}
                                        type="number"
                                        min="0"
                                        error={error}
                                        errorMessage={errorMessage}
                                        errorClasses={ classes.inputError }
                                    />
                                </div>}
                        </Motion>


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
