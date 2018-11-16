import React, { Component } from "react"
import { bindActionCreators, compose } from "redux"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import { withStyles } from "@material-ui/core/styles"
import {
    CircularProgress, Dialog, DialogActions, DialogContent,
    DialogTitle, Typography, withMobileDialog
} from "@material-ui/core"
import { action as KeysActions} from "../../redux/Keys"
import Button from "../../lib/mui-v1/Button"
import { Motion, presets, spring } from "react-motion"




// <ModalAwaitPure> component
export default compose(
    withMobileDialog(),
    withStyles((theme) => ({
        circle: {
            color: theme.palette.custom.blue,
        },
        circularProgress: {
            marginRight: "1rem",
        },
    })),
    connect(
        (state) => ({
            open: state.Keys.ModalAwaitPure.showing,
            awaiting: state.Keys.awaitingShambhalaResponse,
            progressMessage: state.Keys.progressMessage,
        }),
        (dispatch) => bindActionCreators({
            cancelAwaitingResponse: KeysActions.cancelAwaitingResponse,
            hideAwaitPureModal: KeysActions.hideAwaitPureModal,
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
            this.props.hideAwaitPureModal()
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
                        Shambhala Pure
                    </DialogTitle>
                    <DialogContent>
                        <div className="flex-box-col items-centered content-centered">
                            <Typography variant="body2">
                                Please switch to Shambhala tab and follow
                                the procedure there first. Leave this tab
                                open.
                            </Typography>
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
                            <Typography variant="body2">
                                {this.props.progressMessage}
                            </Typography>
                        </div>
                    </DialogContent>
                    <DialogActions>
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
