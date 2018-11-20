import React, { Component } from "react"
import { bindActionCreators, compose } from "redux"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import { withStyles } from "@material-ui/core/styles"
import {
    Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Switch,
    Typography, withMobileDialog
} from "@material-ui/core"
import Button from "../../lib/mui-v1/Button"
import TextInput from "../../lib/mui-v1/TextInput"
import { action as KeysActions } from "../../redux/Keys"
import {
    getAccountIdFromDevice, setSigningMethod, setProgressMessage,
    queryDeviceSoftwareVersion
} from "../../actions/onboarding"
import { setUseDefaultAccount, setAccount } from "../../actions/ledgering"
import { delay, string, type } from "@xcmats/js-toolbox"
import classNames from "classnames"



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
            setAwaitingResponse: KeysActions.setAwaitingResponse,
            cancelAwaitingResponse: KeysActions.cancelAwaitingResponse,
            setAccount,
            setSigningMethod,
            setProgressMessage,
            queryDeviceSoftwareVersion,
            getAccountIdFromDevice,
            setUseDefaultAccount,
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
            errorInput: false,
            errorMessageInput: string.empty(),
        }


        // ...
        handleYes = async () => {
            try {
                await this.props.hideSignupLedgerModal()
                await this.props.showAwaitLedgerModal()
                await this.props.setAwaitingResponse()
                await this.props.setProgressMessage("Querying device ...")
                await delay(2500)
                await this.props.queryDeviceSoftwareVersion()
                await this.props.getAccountIdFromDevice()

                await this.props.cancelAwaitingResponse()
                await this.props.setProgressMessage("Complete.")

                await delay(1500)
                await this.props.hideAwaitLedgerModal()
            } catch (error) {
                await this.props.cancelAwaitingResponse()
                await this.props.setProgressMessage(error.message)
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
            ({ classes, error, errorMessage, fullScreen, open, useDefaultAccount }) =>
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
                        <div className={
                            classNames(
                                "flex-box-row",
                                useDefaultAccount && "transparent"
                            )}
                        >
                            <TextInput
                                label="Account"
                                defaultValue="0"
                                onChange={this.handleChange()}
                                type="number"
                                min="0"
                                error={error}
                                errorMessage={errorMessage}
                                errorClasses={ classes.inputError }
                            />
                        </div>
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
