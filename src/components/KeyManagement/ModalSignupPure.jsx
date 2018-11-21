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
    fundAccount, generateAccountId, generateMultisig, generateSigningKeys,
    setProgressMessage, setSigningMethod
} from "../../actions/onboarding"
import { getLatestAccountState } from "../../actions/stellarAccount"
import Button from "../../lib/mui-v1/Button"
import { delay } from "@xcmats/js-toolbox"


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
            cancelAwaitingResponse: KeysActions.cancelAwaitingResponse,
            setAwaitingResponse: KeysActions.setAwaitingResponse,
            hideSignupPureModal: KeysActions.hideSignupPureModal,
            showAwaitPureModal: KeysActions.showAwaitPureModal,
            hideAwaitPureModal: KeysActions.hideAwaitPureModal,
            fundAccount,
            generateAccountId,
            generateSigningKeys,
            setProgressMessage,
            setSigningMethod,
            getLatestAccountState,
            generateMultisig,
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
            await this.props.hideSignupPureModal()
            await this.props.showAwaitPureModal()
            await this.props.setAwaitingResponse()
            await this.props.setProgressMessage(
                "Awaiting response ..."
            )

            // await delay(2500)

            // SHAMBHALA -------- BEGIN
            await this.props.setProgressMessage(
                "Generating account number ..."
            )
            // await delay(1500)

            await this.props.generateAccountId()
            await this.props.setProgressMessage(
                "Generating signatures ..."
            )
            await this.props.generateSigningKeys()

            await this.props.setProgressMessage(
                "Funding account ..."
            )

            await this.props.fundAccount()

            await this.props.getLatestAccountState()

            await this.props.setProgressMessage("Creating multisig ...")
            await this.props.generateMultisig()

            await this.props.cancelAwaitingResponse()
            await this.props.setProgressMessage("Complete.")

            await delay(1500)

            // SHAMBHALA -------- END


            await this.props.hideAwaitPureModal()
        }


        // ...
        handleNo = () => {
            this.props.hideSignupPureModal()
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
                        Shambhala Pure - Welcome!
                    </DialogTitle>
                    <DialogContent>
                        <Typography variant="h6">
                            In a moment we will generate your digital signature key.
                            Please follow the instructions in separate tab that
                            will open momentarily.
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
