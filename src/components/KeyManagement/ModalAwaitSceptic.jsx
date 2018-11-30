import React, { Component } from "react"
import { bindActionCreators, compose } from "redux"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import { withStyles } from "@material-ui/core/styles"
import {
    CircularProgress, Dialog, DialogActions, DialogContent,
    DialogTitle, Typography, withMobileDialog
} from "@material-ui/core"
import TextField from "@material-ui/core/TextField"
import Button from "../../lib/mui-v1/Button"
import { action as KeysActions } from "../../redux/Keys"
import { action as SnackyActions } from "../../redux/Snacky"
import { Motion, presets, spring } from "react-motion"
import {
    cancel,
    passSignature,
} from "../../actions/recipes/signupSceptic"
import { ErrorOutline } from "@material-ui/icons"




// <ModalAwaitSceptic> component
export default compose(
    withMobileDialog(),
    withStyles((theme) => ({
        circle: {
            color: theme.palette.custom.purpleLight,
        },
        circularProgress: {
            marginRight: "1rem",
        },
        errorIcon: {
            fontSize: "5rem",
        },
        paper: {
            backgroundColor: theme.palette.custom.purpleDark,
        },
    })),
    connect(
        (state) => ({
            open: state.Keys.ModalAwaitSceptic.showing,
            spinnerVisible: state.Keys.spinnerVisible,
            progressMessage: state.Keys.progressMessage,
            errorMessage: state.Keys.errorMessage,
            txBody: state.Keys.txBody,
        }),
        (dispatch) => bindActionCreators({
            cancel,
            passSignature,
            resetState: KeysActions.resetState,
            showSnacky: SnackyActions.showSnacky,
            setSnackyMessage: SnackyActions.setMessage,
            setSnackyColor: SnackyActions.setColor,
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
        handleNo = async () => {
            await this.props.cancel()
            this.props.resetState()
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
                        Shambhala Sceptic - Onboarding Progress
                    </DialogTitle>
                    <DialogContent>
                        <div className="flex-box-col items-centered content-centered">

                            {/* ============ PROGRESS SPINNER ============= */}
                            {this.props.spinnerVisible &&
                            <Motion defaultStyle={{ opacity: 0 }}
                                style={{
                                    opacity: spring(this.props.spinnerVisible ? 1 : 0, presets.gentle),
                                }}
                            >
                                {value =>
                                    <div style={{
                                        opacity: value.opacity,
                                    }} className="flex-box-row items-centered"
                                    >
                                        <CircularProgress disableShrink size={60}
                                            classes={{
                                                circle: classes.circle,
                                                root: classes.circularProgress,
                                            }}
                                        />
                                    </div>
                                }
                            </Motion>
                            }

                            {/* ============ ERROR BADGE ============= */}
                            {this.props.errorMessage &&
                            <Motion defaultStyle={{ opacity: 0 }}
                                style={{
                                    opacity: spring(this.props.errorMessage ? 1 : 0, presets.gentle),
                                }}
                            >
                                {value =>
                                    <div style={{
                                        opacity: value.opacity,
                                    }} className="flex-box-row items-centered"
                                    >
                                        <span className="orange-light">
                                            <ErrorOutline classes={{ root: classes.errorIcon }} />
                                        </span>

                                    </div>
                                }
                            </Motion>
                            }


                            {/* ============ PROGRESS MESSAGE ============= */}
                            {this.props.progressMessage &&
                            <Motion defaultStyle={{ opacity: 0 }}
                                style={{
                                    opacity: spring(
                                        this.props.progressMessage ? 1 : 0,
                                        presets.gentle
                                    ),
                                }}
                            >
                                {value =>
                                    <div
                                        style={{ opacity: value.opacity }}
                                        className="m-t flex-box-row items-centered"
                                    >
                                        <Typography variant="body2">
                                            {this.props.progressMessage}
                                        </Typography>
                                    </div>
                                }
                            </Motion>
                            }


                            {/* ============ TRANSACTION BODY ============= */}
                            {this.props.txBody &&
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
                            }


                            {/* =========== SIGNED TRANSACTION ============ */}
                            {this.props.txBody &&
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
                            }


                            {/* ============= ERROR MESSAGE =============== */}
                            {this.props.errorMessage &&
                            <Motion defaultStyle={{ opacity: 0 }}
                                style={{
                                    opacity: spring(
                                        this.props.errorMessage ? 1 : 0,
                                        presets.gentle
                                    ),
                                }}
                            >
                                {value =>
                                    <div
                                        style={{ opacity: value.opacity }}
                                        className="m-t flex-box-row items-centered"
                                    >
                                        <Typography variant="body2">
                                            <span className="orange-light">
                                                {this.props.errorMessage}
                                            </span>
                                        </Typography>
                                    </div>
                                }
                            </Motion>
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
