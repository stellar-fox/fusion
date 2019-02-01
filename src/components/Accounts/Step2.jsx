import React from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import { withStyles } from "@material-ui/core/styles"
import {
    func,
    handleException,
    shorten
} from "@xcmats/js-toolbox"
import {
    Table,
    TableBody,
    TableCell,
    TableRow,
    Typography,
    withMobileDialog
} from "@material-ui/core"
import { fade } from "@material-ui/core/styles/colorManipulator"
import { signingMethod as sm } from "../../redux/Keys"




/**
 * Fusion.
 *
 * Step 2 for creating new account.
 *
 * @module client-ui-components
 * @license Apache-2.0
 */




/**
 * `<Step2>` component.
 *
 * @function Step2
 * @returns {React.ReactElement}
 */
const Step2 = ({account, accountId, classes, name, signingMethod}) =>
    
    <div className="flex-box-col">
        <Typography
            style={{ margin: "0 0 1rem 0" }}
            variant="body2"
        >
            New Account Summary
        </Typography>
        <Table classes={{ root: classes.table }}>
            <TableBody>
                <TableRow key="summary-account-name" classes={{ root: classes.tableRow }}>
                    <TableCell classes={{ root: classes.tableCell }} padding="none">
                        Account Name:
                    </TableCell>
                    <TableCell classes={{ root: classes.tableCell }} align="right" padding="none">
                        {name}
                    </TableCell>
                </TableRow>
                <TableRow key="summary-signing-method" classes={{ root: classes.tableRow }}>
                    <TableCell classes={{ root: classes.tableCell }} padding="none">
                        Signing Method:
                    </TableCell>
                    <TableCell classes={{ root: classes.tableCell }} align="right" padding="none">
                        {signingMethod}
                    </TableCell>
                </TableRow>
                {func.choose(signingMethod, {
                    [sm.SHAMBHALA]: () => func.identity(),
                    [sm.LEDGERHQ]: () =>
                        <TableRow key="summary-ledger-account" classes={{ root: classes.tableRow }}>
                            <TableCell classes={{ root: classes.tableCell }} padding="none">
                                Ledger Acount:
                            </TableCell>
                            <TableCell classes={{ root: classes.tableCell }} align="right" padding="none">
                                {account}
                            </TableCell>
                        </TableRow>,
                    [sm.MANUAL]: () => <TableRow key="summary-account-id" classes={{ root: classes.tableRow }}>
                        <TableCell classes={{ root: classes.tableCell }} padding="none">
                            Account ID:
                        </TableCell>
                        <TableCell classes={{ root: classes.tableCell }} align="right" padding="none">
                            {handleException(() => shorten(accountId, 11, shorten.MIDDLE, "-"), () => accountId)}
                        </TableCell>
                    </TableRow>,
                }, () => "Invalid signing method.")}
            </TableBody>
        </Table>
        <Typography
            style={{ margin: "1rem 0" }}
            variant="h4"
        >
            Please make sure the information in the above table is
            correct and click <span className="cursive">FINISH
            </span> to create your account.
        </Typography>
    </div>




// ...
export default func.compose(
    withMobileDialog(),
    withStyles((theme) => ({
        root: {
            "&$checked": {
                color: theme.palette.custom.yellowDark,
            },
        },
        checked: {},
        table: {
            fontFamily: "'Roboto Condensed', sans-serif",
        },
        tableCell: {
            fontSize: "0.75rem",
            fontWeight: 100,
            borderBottom: "none !important",
        },
        tableRow: {
            cursor: "pointer",
            borderBottom: `1px solid ${fade(theme.palette.custom.antiFlashWhite, 0.4)} !important`,
            "&:last-child": {
                borderBottom: "none !important",
                borderTop: "none !important",
            },
        },
    })),
    connect(
        (state) => ({
            account: state.LedgerHQ.account,
            accountId: state.Keys.accountId,
            signingMethod: state.Keys.signingMethod,
            name: state.AddAccount.name,
        }),
        (dispatch) => bindActionCreators({}, dispatch),
    ),
)(Step2)
