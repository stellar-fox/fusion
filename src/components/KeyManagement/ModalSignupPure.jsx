import React, { Component } from "react"
import { bindActionCreators, compose } from "redux"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import { withStyles } from "@material-ui/core/styles"
import {
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    withMobileDialog
} from "@material-ui/core"
import { action as KeysActions} from "../../redux/Keys"
import {
    fundAccount, generateAccountId, generateSigningKeys, setProgressMessage,
    setSigningMethod
} from "../../actions/onboarding"
import Button from "../../lib/mui-v1/Button"
import { delay, string } from "@xcmats/js-toolbox"


// <ModalSignupPure> component
export default compose(
    withMobileDialog(),
    withStyles((theme) => ({
        textBlue: {
            color: theme.palette.custom.blue,
        },
    })),
    connect(
        (state) => ({
            open: state.Keys.ModalSignupPure.showing,
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
            await this.props.hideSignupPureModal()
            await this.props.showAwaitPureModal()
            await this.props.setAwaitingResponse()
            await this.props.setProgressMessage(
                "Awaiting response ..."
            )

            await delay(2500)

            // SHAMBHALA -------- BEGIN
            await this.props.setProgressMessage(
                "Generating account number ..."
            )
            await delay(1500)

            await this.props.generateAccountId()
            await this.props.setProgressMessage(
                "Generating signatures ..."
            )
            await this.props.generateSigningKeys()

            await this.props.setProgressMessage(
                "Funding account ..."
            )

            await this.props.fundAccount()
            await this.props.cancelAwaitingResponse()
            await this.props.setProgressMessage(
                "Complete."
            )

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
                >
                    <DialogTitle id="responsive-dialog-title">
                        Shambhala Pure - Welcome
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText classes={{ root: classes.textBlue }}>
                        In a moment we will generate your signature key.
                        DO NOT EVER share it with anyone. This key has the total
                        control over your funds and entire account. This is why
                        it will only be shown to you once here and never again.
                        Understandably, we will never have access to this key
                        and therefore cannot help you, should you loose access
                        to it. Make sure to store it safely!
                        </DialogContentText>
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
