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
import { delay, string } from "@xcmats/js-toolbox"


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
            account: state.Keys.account,
        }),
        (dispatch) => bindActionCreators({
            hideSignupLedgerModal: KeysActions.hideSignupLedgerModal,
            showAwaitLedgerModal: KeysActions.showAwaitLedgerModal,
            hideAwaitLedgerModal: KeysActions.hideAwaitLedgerModal,
            setAwaitingResponse: KeysActions.setAwaitingResponse,
            cancelAwaitingResponse: KeysActions.cancelAwaitingResponse,
            setAccount: KeysActions.setAccount,
            setSigningMethod,
            setProgressMessage,
            queryDeviceSoftwareVersion,
            getAccountIdFromDevice,
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
            useDefaultAccount: true,
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
        handleSwitch = () => (event) => {
            this.setState({ useDefaultAccount: event.target.checked })
            if (event.target.checked) {
                this.props.setAccount("0")
            }
        }


        // ...
        handleChange = () => (event) => {
            if (!event.target.value || isNaN(event.target.value)) {
                this.setState({
                    errorInput: true,
                    errorMessageInput: "Invalid input. Integer numbers only.",
                })
                this.props.setAccount("0")
                return false
            }

            this.setState({
                errorInput: false,
                errorMessageInput: string.empty(),
            })

            this.props.setAccount(event.target.value)
            
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
                        <div className="m-t flex-box-row">
                            <FormControlLabel control={
                                <Switch
                                    checked={this.state.useDefaultAccount}
                                    onChange={this.handleSwitch()}
                                />
                            } label="Use Default Account"
                            />
                        </div>
                        <div className="flex-box-row">
                            <TextInput
                                label="Account"
                                defaultValue="0"
                                onChange={this.handleChange()}
                                type="number"
                                error={this.state.errorInput}
                                errorMessage={this.state.errorMessageInput}
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
