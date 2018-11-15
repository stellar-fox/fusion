import React, { Component } from "react"
import { bindActionCreators, compose } from "redux"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import { withStyles } from "@material-ui/core/styles"
import {
    CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText,
    DialogTitle, Typography, withMobileDialog
} from "@material-ui/core"
import { action as KeysActions} from "../../redux/Keys"
import Button from "../../lib/mui-v1/Button"
import { Motion, presets, spring } from "react-motion"




// <ModalAwaitPure> component
export default compose(
    withMobileDialog(),
    withStyles((theme) => ({
        textBlue: {
            color: theme.palette.custom.blue,
        },
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
                        <DialogContentText classes={{ root: classes.textBlue }}>
                            <div className="flex-box-col items-centered content-centered">
                                <Typography variant="body2">
                                    Please switch to Shambhala tab and follow
                                    the procedure there first. Leave this tab
                                    open.
                                </Typography>
                                <Motion defaultStyle={{ opacity: 0 }}
                                    style={{
                                        opacity: spring(1, presets.gentle),
                                    }}
                                >
                                    {value =>
                                        <div style={{
                                            opacity: value.opacity,
                                        }} className="m-t flex-box-row items-centered"
                                        >
                                            <CircularProgress disableShrink size={20}
                                                classes={{
                                                    circle: classes.circle,
                                                    root: classes.circularProgress,
                                                }}
                                            />
                                            <Typography variant="h4">
                                                Awaiting response ...
                                            </Typography>
                                        </div>
                                    }
                                </Motion>
                            </div>
                        </DialogContentText>
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
