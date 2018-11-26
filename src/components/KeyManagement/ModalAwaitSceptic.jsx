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
import { action as KeysActions } from "../../redux/Keys"
import Button from "../../lib/mui-v1/Button"
import { Motion, presets, spring } from "react-motion"




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
        paper: {
            backgroundColor: theme.palette.custom.purpleDark,
        },
    })),
    connect(
        (state) => ({
            open: state.Keys.ModalAwaitSceptic.showing,
            awaiting: state.Keys.awaitingShambhalaResponse,
            progressMessage: state.Keys.progressMessage,
            errorMessage: state.Keys.errorMessage,
            txBody: state.Keys.txBody,
        }),
        (dispatch) => bindActionCreators({
            cancelAwaitingResponse: KeysActions.cancelAwaitingResponse,
            hideAwaitScepticModal: KeysActions.hideAwaitScepticModal,
        }, dispatch)
    )
)(
    class extends Component {

        // ...
        static propTypes = {
            classes: PropTypes.object.isRequired,
        }


        // ...
        handleNo = () => {
            this.props.cancelAwaitingResponse()
            this.props.hideAwaitScepticModal()
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
                        Shambhala Sceptic - Onboarding Progress
                    </DialogTitle>
                    <DialogContent>
                        <div className="flex-box-col items-centered content-centered">

                            {/* ============ PROGRESS MESSAGE ============= */}
                            {this.props.awaiting &&
                            <Motion defaultStyle={{ opacity: 0 }}
                                style={{
                                    opacity: spring(this.props.awaiting ? 1 : 0, presets.gentle),
                                }}
                            >
                                {value =>
                                    <div style={{
                                        opacity: value.opacity,
                                    }} className="m-t m-b flex-box-row items-centered"
                                    >
                                        <CircularProgress disableShrink size={20}
                                            classes={{
                                                circle: classes.circle,
                                                root: classes.circularProgress,
                                            }}
                                        />
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
                                        className="m-t m-b flex-box-row items-centered"
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
                                            InputProps={{ readOnly: true }}
                                            InputLabelProps={{ shrink: true }}
                                            label="Transaction Body"
                                            multiline
                                            rowsMax="5"
                                            margin="normal"
                                            variant="outlined"
                                            value={this.props.txBody}
                                            fullWidth
                                        />

                                        <Button
                                            // onClick={this.handleNo}
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
                                            label="Signed Transaction Body"
                                            multiline
                                            rowsMax="5"
                                            margin="normal"
                                            variant="outlined"
                                            placeholder="Paste signed transaction here."
                                            fullWidth
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
                                        className="m-t m-b flex-box-row items-centered"
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
