import React, { Component } from "react"
import { bindActionCreators, compose } from "redux"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import { withStyles } from "@material-ui/core/styles"
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Table,
    TableBody,
    TableCell,
    TableRow,
    withMobileDialog
} from "@material-ui/core"
import { string } from "@xcmats/js-toolbox"
import { action as KeysActions} from "../../redux/Keys"
import { submitTx } from "../../actions/recipes/signup"
import { cancel, saveAccountData } from "../../actions/onboarding"
import Button from "../../lib/mui-v1/Button"
import Awaiter from "../Awaiter"




// <ModalTransactionDetails> component
export default compose(
    withMobileDialog(),
    withStyles((theme) => ({
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
            txHash: state.Keys.txHash,
            txSourceAccount: state.Keys.txSourceAccount,
            txSequenceNumber: state.Keys.txSequenceNumber,
            txFee: state.Keys.txFee,
            txOpsNum: state.Keys.txOpsNum,
            txSignature: state.Keys.txSignature,
            yesButtonDisabled: state.Keys.yesButtonDisabled,
            noButtonDisabled: state.Keys.noButtonDisabled,
        }),
        (dispatch) => bindActionCreators({
            cancel,
            hideTransactionDetailsModal: KeysActions.hideTransactionDetailsModal,
            resetState: KeysActions.resetState,
            saveAccountData,
            submitTx,
        }, dispatch)
    )
)(
    class extends Component {

        // ...
        static propTypes = {
            classes: PropTypes.object.isRequired,
        }

        // ...
        handleNo = () => this.props.cancel()


        // ...
        handleYes = async () => {
            await this.props.submitTx()
            await this.props.saveAccountData()
        }


        // ...
        render = () => (
            ({ classes, fullScreen, open, noButtonDisabled, yesButtonDisabled }) =>
                <Dialog
                    fullScreen={fullScreen}
                    open={open}
                    aria-labelledby="responsive-dialog-title"
                    classes={{ paper: classes.paper }}
                >
                    <DialogTitle id="responsive-dialog-title">
                        Shambhala Scaptic: Transaction Details
                    </DialogTitle>
                    <DialogContent>
                        <div className="flex-box-col items-centered content-centered">
                            <Awaiter />

                            <Table classes={{ root: classes.table }}>
                                <TableBody>
                                    <TableRow key="network" classes={{ root: classes.tableRow }}>
                                        <TableCell classes={{ root: classes.tableCell }} padding="none">
                                            Signing For:
                                        </TableCell>
                                        <TableCell classes={{ root: classes.tableCell }} numeric padding="none">
                                            {this.props.networkPassphrase}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow key="txHash" classes={{ root: classes.tableRow }}>
                                        <TableCell classes={{ root: classes.tableCell }} padding="none">
                                            Transaction Hash:
                                        </TableCell>
                                        <TableCell classes={{ root: classes.tableCell }} numeric padding="none">
                                            {string.shorten(this.props.txHash, 30)}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow key="txSourceAccount" classes={{ root: classes.tableRow }}>
                                        <TableCell classes={{ root: classes.tableCell }} padding="none">
                                            Source Account:
                                        </TableCell>
                                        <TableCell classes={{ root: classes.tableCell }} numeric padding="none">
                                            {string.shorten(this.props.txSourceAccount, 25)}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow key="txSequenceNumber" classes={{ root: classes.tableRow }}>
                                        <TableCell classes={{ root: classes.tableCell }} padding="none">
                                            Sequence Number:
                                        </TableCell>
                                        <TableCell classes={{ root: classes.tableCell }} numeric padding="none">
                                            {this.props.txSequenceNumber}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow key="txFee" classes={{ root: classes.tableRow }}>
                                        <TableCell classes={{ root: classes.tableCell }} padding="none">
                                            Transaction Fee:
                                        </TableCell>
                                        <TableCell classes={{ root: classes.tableCell }} numeric padding="none">
                                            {this.props.txFee}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow key="txOpsNum" classes={{ root: classes.tableRow }}>
                                        <TableCell classes={{ root: classes.tableCell }} padding="none">
                                            Operations:
                                        </TableCell>
                                        <TableCell classes={{ root: classes.tableCell }} numeric padding="none">
                                            {this.props.txOpsNum}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow key="txSignature" classes={{ root: classes.tableRow }}>
                                        <TableCell classes={{ root: classes.tableCell }} padding="none">
                                            Signature:
                                        </TableCell>
                                        <TableCell classes={{ root: classes.tableCell }} numeric padding="none">
                                            {string.shorten(this.props.txSignature, 30)}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>

                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={this.handleYes} color="green"
                            disabled={yesButtonDisabled}
                        >
                            Submit
                        </Button>
                        <Button style={{margin: "0 3px 0 10px"}}
                            onClick={this.handleNo} color="yellow"
                            disabled={noButtonDisabled}
                        >
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
        )(this.props)

    }
)
