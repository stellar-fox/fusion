import React, { Component } from "react"
import { bindActionCreators, compose } from "redux"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import { withStyles } from "@material-ui/core/styles"
import {
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Typography,
    withMobileDialog
} from "@material-ui/core"
import { action as KeysActions} from "../../redux/Keys"
import { Motion, presets, spring } from "react-motion"
import Button from "../../lib/mui-v1/Button"




// <ModalTransactionDetails> component
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
        table: {
            fontFamily: "'Roboto Condensed', sans-serif",
        },
        tableCell: {
            fontSize: "0.75rem",
            fontWeight: 100,
            borderBottom: "none !important",
        },
        tableRow: {
            borderBottom: `1px solid ${theme.palette.custom.purple} !important`,
            "&:last-child": {
                borderBottom: "none !important",
                borderTop: "none !important",
            },
        },
    })),
    connect(
        (state) => ({
            networkPassphrase: state.Keys.networkPassphrase,
            open: state.Keys.ModalTransactionDetails.showing,
            spinnerVisible: state.Keys.spinnerVisible,
        }),
        (dispatch) => bindActionCreators({
            hideAwaitPureModal: KeysActions.hideAwaitPureModal,
            hideTransactionDetailsModal: KeysActions.hideTransactionDetailsModal,
        }, dispatch)
    )
)(
    class extends Component {

        // ...
        static propTypes = {
            classes: PropTypes.object.isRequired,
        }

        // ...
        handleNo = () => this.props.hideTransactionDetailsModal()

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
                        Shambhala Scaptic - Transaction Details
                    </DialogTitle>
                    <DialogContent>
                        <div className="flex-box-col items-centered content-centered">

                            <Motion defaultStyle={{ opacity: 0 }}
                                style={{
                                    opacity: spring(this.props.spinnerVisible ? 1 : 0, presets.gentle),
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

                            <Motion defaultStyle={{ opacity: 0 }}
                                style={{
                                    opacity: spring(this.props.progressMessage ? 1 : 0, presets.gentle),
                                }}
                            >
                                {value =>
                                    <div style={{
                                        opacity: value.opacity,
                                    }} className="m-t m-b flex-box-row items-centered"
                                    >
                                        <Typography variant="body2">
                                            {this.props.progressMessage}
                                        </Typography>
                                    </div>
                                }
                            </Motion>

                            <Motion defaultStyle={{ opacity: 0 }}
                                style={{
                                    opacity: spring(this.props.errorMessage ? 1 : 0, presets.gentle),
                                }}
                            >
                                {value =>
                                    <div style={{
                                        opacity: value.opacity,
                                    }} className="m-t m-b flex-box-row items-centered"
                                    >
                                        <Typography variant="body2">
                                            <span className="orange-light">
                                                {this.props.errorMessage}
                                            </span>
                                        </Typography>
                                    </div>
                                }
                            </Motion>

                            <Table classes={{ root: classes.table }}>
                                <TableBody>
                                    <TableRow key="network" classes={{ root: classes.tableRow }}>
                                        <TableCell classes={{ root: classes.tableCell }} padding="none">Signing For:</TableCell>
                                        <TableCell classes={{ root: classes.tableCell }} numeric padding="none">{this.props.networkPassphrase}</TableCell>
                                    </TableRow>
                                    <TableRow key="txHash" classes={{ root: classes.tableRow }}>
                                        <TableCell classes={{ root: classes.tableCell }} padding="none">Transaction Hash:</TableCell>
                                        <TableCell classes={{ root: classes.tableCell }} numeric padding="none">{this.props.txHash}</TableCell>
                                    </TableRow>
                                    <TableRow key="txSourceAccount" classes={{ root: classes.tableRow }}>
                                        <TableCell classes={{ root: classes.tableCell }} padding="none">Source Account:</TableCell>
                                        <TableCell classes={{ root: classes.tableCell }} numeric padding="none">{this.props.txSourceAccount}</TableCell>
                                    </TableRow>
                                    <TableRow key="txSequenceNumber" classes={{ root: classes.tableRow }}>
                                        <TableCell classes={{ root: classes.tableCell }} padding="none">Sequence Number:</TableCell>
                                        <TableCell classes={{ root: classes.tableCell }} numeric padding="none">{this.props.txSequenceNumber}</TableCell>
                                    </TableRow>
                                    <TableRow key="txFee" classes={{ root: classes.tableRow }}>
                                        <TableCell classes={{ root: classes.tableCell }} padding="none">Transaction Fee:</TableCell>
                                        <TableCell classes={{ root: classes.tableCell }} numeric padding="none">{this.props.txFee}</TableCell>
                                    </TableRow>
                                    <TableRow key="txOpsNum" classes={{ root: classes.tableRow }}>
                                        <TableCell classes={{ root: classes.tableCell }} padding="none">Operations:</TableCell>
                                        <TableCell classes={{ root: classes.tableCell }} numeric padding="none">{this.props.txOpsNum}</TableCell>
                                    </TableRow>
                                    <TableRow key="txSignature" classes={{ root: classes.tableRow }}>
                                        <TableCell classes={{ root: classes.tableCell }} padding="none">Signature:</TableCell>
                                        <TableCell classes={{ root: classes.tableCell }} numeric padding="none">{this.props.txSignature}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>

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
