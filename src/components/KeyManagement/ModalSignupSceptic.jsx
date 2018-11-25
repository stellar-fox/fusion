import React, { Component } from "react"
import { bindActionCreators, compose } from "redux"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import { withStyles } from "@material-ui/core/styles"
import {
    Dialog, DialogActions, DialogContent, DialogTitle, Typography,
    withMobileDialog
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
import { codec, func, /* delay, */ string } from "@xcmats/js-toolbox"




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
            backgroundColor: theme.palette.custom.purpleDark,
        },
    })),
    connect(
        (state) => ({
            open: state.Keys.ModalSignupSceptic.showing,
        }),
        (dispatch) => bindActionCreators({
            hideSignupScepticModal: KeysActions.hideSignupScepticModal,
            showAwaitScepticModal: KeysActions.showAwaitScepticModal,
            hideAwaitScepticModal: KeysActions.hideAwaitScepticModal,
            setAwaitingResponse: KeysActions.setAwaitingResponse,
            cancelAwaitingResponse: KeysActions.cancelAwaitingResponse,
            setAccountId: KeysActions.setAccountId,
            setTxBody: KeysActions.setTxBody,
            setSigningMethod,
            setErrorMessage,
            setProgressMessage,
            getLatestAccountState,
            addSigningMethodToAccount,
            generateMultisigTx,
            obtainAccountId,
            generateSigningKeys,
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
                await this.props.setTxBody(null)
                await this.props.setProgressMessage(string.empty())
                await this.props.setErrorMessage(string.empty())

                await this.props.hideSignupScepticModal()
                await this.props.showAwaitScepticModal()

                await this.props.setAwaitingResponse()
                await this.props.setProgressMessage(
                    "ACTION REQUIRED. Check pop-up window."
                )
                await this.props.obtainAccountId()
                await this.props.generateSigningKeys()

                await this.props.setProgressMessage(
                    "Fetching current account data ..."
                )
                await this.props.getLatestAccountState()
                await this.props.addSigningMethodToAccount()

                await this.props.setProgressMessage(
                    "Generating transaction body ..."
                )
                const tx = await this.props.generateMultisigTx()
                await this.props.setTxBody(func.pipe(tx)(
                    (t) => t.toEnvelope(),
                    (e) => e.toXDR(),
                    codec.b64enc
                ),)

                await this.props.cancelAwaitingResponse()
                await this.props.setProgressMessage(string.empty())

                // await this.props.setProgressMessage(
                //     "Submitting ..."
                // )
                // await this.props.submitTransaction(signedTx)

                // await this.props.cancelAwaitingResponse()
                // await this.props.setProgressMessage("Complete.")

                // await delay(1500)
                // await this.props.hideAwaitScepticModal()


            } catch (error) {
                await this.props.cancelAwaitingResponse()
                await this.props.setProgressMessage(string.empty())
                await this.props.setErrorMessage(error.message)
            }

        }


        // ...
        handleNo = () => {
            this.props.hideSignupScepticModal()
            this.props.setSigningMethod(null)
        }


        // ...
        handleChange = () => (event) =>
            this.props.setAccountId(event.target.value)


        // ...
        render = () => (
            ({ classes, error, errorMessage, fullScreen, open }) =>
                <Dialog
                    fullScreen={fullScreen}
                    open={open}
                    aria-labelledby="responsive-dialog-title"
                    classes={{ paper: classes.paper }}
                >
                    <DialogTitle classes={{ root: classes.dialogTitle }}
                        id="responsive-dialog-title"
                    >
                        Shambhala Sceptic - Welcome!
                    </DialogTitle>
                    <DialogContent>
                        <Typography variant="h6">
                            We will add two additional signers to
                            your <span className="cursive">Stellar Account
                            </span>.
                        </Typography>
                        <div className="m-t flex-box-row">
                            <TextInput
                                label="Stellar Account ID"
                                defaultValue={this.props.account}
                                onChange={this.handleChange()}
                                type="text"
                                fullWidth
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
