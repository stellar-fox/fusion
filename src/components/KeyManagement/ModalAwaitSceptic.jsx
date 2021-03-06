import React, { Component, Fragment } from "react"
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
import TextField from "@material-ui/core/TextField"
import Button from "../../lib/mui-v1/Button"
import { action as SnackyActions } from "../../redux/Snacky"
import { Motion, presets, spring } from "react-motion"
import { passSignature } from "../../actions/recipes/sign"
import {
    closeShambhala,
    resetOnboardingState,
} from "../../actions/onboarding"
import Awaiter from "../Awaiter"
import { action as AwaiterActions } from "../../redux/Awaiter"




// <ModalAwaitSceptic> component
export default compose(
    withMobileDialog(),
    withStyles((theme) => ({
        paper: {
            backgroundColor: theme.palette.custom.purpleDark,
        },
    })),
    connect(
        (state) => ({
            open: state.Keys.ModalAwaitSceptic.showing,
            txBody: state.Keys.txBody,
        }),
        (dispatch) => bindActionCreators({
            closeShambhala,
            passSignature,
            resetOnboardingState,
            showSnacky: SnackyActions.showSnacky,
            setSnackyMessage: SnackyActions.setMessage,
            setSnackyColor: SnackyActions.setColor,
            resetAwaiterState: AwaiterActions.resetState,
        }, dispatch)
    )
)(
    class extends Component {

        // ...
        static propTypes = {
            classes: PropTypes.object.isRequired,
        }


        constructor (props) {
            super(props)
            this.textInput = React.createRef()
        }


        // ...
        handleNo = () => {
            this.props.closeShambhala()
            this.props.resetOnboardingState()
            this.props.resetAwaiterState()
        }


        // ...
        handleUserInputChange = () => (event) =>
            this.props.passSignature(event.target.value)


        // ...
        copyToClipboard = () => {
            this.selectTextInput()
            if (document.execCommand("copy")) {
                const showSuccess = async () => {
                    await this.props.setSnackyColor("success")
                    await this.props.setSnackyMessage(
                        "Transaction copied to clipboard."
                    )
                    await this.props.showSnacky()
                }
                showSuccess()
            } else {
                const showError = async () => {
                    await this.props.setSnackyColor("error")
                    await this.props.setSnackyMessage(
                        "Could not copy to clipboard."
                    )
                    await this.props.showSnacky()
                }
                showError()
            }
        }


        // ...
        selectTextInput = () => this.textInput.current.select()


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
                        Shambhala Sceptic: Onboarding
                    </DialogTitle>
                    <DialogContent>
                        <div className="flex-box-col items-centered content-centered">

                            <Awaiter />

                            {this.props.txBody &&
                            <Fragment>
                                <Motion defaultStyle={{ opacity: 0 }}
                                    style={{
                                        opacity: spring(
                                            this.props.txBody ? 1 : 0,
                                            presets.gentle
                                        ),
                                    }}
                                >
                                    {value =>
                                        <div
                                            style={{ opacity: value.opacity }}
                                            className="m-b flex-box-col items-centered"
                                        >
                                            <TextField
                                                InputProps={{
                                                    readOnly: true,
                                                    fullWidth: true,
                                                }}
                                                inputRef={this.textInput}
                                                InputLabelProps={{ shrink: true }}
                                                label="Transaction Body"
                                                multiline
                                                rowsMax="10"
                                                margin="normal"
                                                variant="outlined"
                                                value={this.props.txBody}
                                                fullWidth
                                                onClick={this.selectTextInput}
                                            />

                                            <Button
                                                onClick={this.copyToClipboard}
                                                color="green"
                                            >
                                                Copy To Clipboard
                                            </Button>
                                        </div>
                                    }
                                </Motion>
                                <Motion defaultStyle={{ opacity: 0 }}
                                    style={{
                                        opacity: spring(
                                            this.props.txBody ? 1 : 0,
                                            presets.gentle
                                        ),
                                    }}
                                >
                                    {value =>
                                        <div
                                            style={{ opacity: value.opacity }}
                                            className="m-b flex-box-col items-centered"
                                        >
                                            <TextField
                                                InputLabelProps={{ shrink: true }}
                                                label="Signature"
                                                multiline
                                                rowsMax="5"
                                                margin="normal"
                                                variant="outlined"
                                                placeholder="Paste signed transaction here."
                                                fullWidth
                                                onChange={this.handleUserInputChange()}
                                            />
                                        </div>
                                    }
                                </Motion>
                            </Fragment>
                            }

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
