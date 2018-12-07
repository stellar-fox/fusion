import React, { Component, Fragment } from "react"
import { bindActionCreators, compose } from "redux"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import { withStyles } from "@material-ui/core/styles"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
} from "@material-ui/core"
import { func, string } from "@xcmats/js-toolbox"
import { signingMethod as sm } from "../../redux/Keys"




// <Roster> component
export default compose(
    withStyles((theme) => ({
        colorShambhala: {
            backgroundColor: theme.palette.custom.blueDark,
        },
        colorLedgerHQ: {
            backgroundColor: theme.palette.custom.greenDark,
        },
        colorManual: {
            backgroundColor: theme.palette.custom.purpleDark,
        },
        colorUnknown: {
            backgroundColor: theme.palette.custom.davysGray,
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
            borderBottom: `1px solid ${theme.palette.custom.darkGunmetal} !important`,
            "&:last-child": {
                borderBottom: "none !important",
                borderTop: "none !important",
            },
        },
    })),
    connect(
        (state) => ({
            accounts: Object.keys(state.StellarAccounts),
            stellarAccounts: state.StellarAccounts,
        }),
        (dispatch) => bindActionCreators({}, dispatch)
    )
)(
    class extends Component {

        // ...
        static propTypes = {
            classes: PropTypes.object.isRequired,
        }


        // ...
        bar = (account) =>
            this.props.stellarAccounts[account].signingMethods.map((signingMethod) => {
                return <div key={`${account}-${signingMethod}`} style={{
                    width: "3px",
                    marginRight: "3px",
                }} className={
                    func.choose(signingMethod, {
                        [sm.SHAMBHALA]: () => this.props.classes.colorShambhala,
                        [sm.LEDGERHQ]: () => this.props.classes.colorLedgerHQ,
                        [sm.MANUAL]: () => this.props.classes.colorManual,
                    }, () => this.props.classes.colorUnknown)
                }
                ></div>
            })


        // ...
        render = () => (
            ({ accounts, classes }) =>
                <Fragment>
                    <Typography variant="h5">
                        $1,234,567.89
                    </Typography>

                    <Table classes={{ root: classes.table }}>
                        <TableHead>
                            <TableRow>
                                <TableCell padding="none">Account Name</TableCell>
                                <TableCell padding="none" numeric>Available</TableCell>
                                <TableCell padding="none" numeric>Balance</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {accounts.map((account) => {
                                return <TableRow key={account} classes={{ root: classes.tableRow }}>
                                    <TableCell classes={{ root: classes.tableCell }} padding="none">
                                        <div className="flex-box-row">
                                            {this.bar(account)}
                                            <div className="flex-box-col">
                                                <div>No name</div>
                                                <div>{string.shorten(account, 11, string.shorten.MIDDLE, "-")}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell classes={{ root: classes.tableCell }} numeric padding="none">
                                        0.00
                                    </TableCell>
                                    <TableCell classes={{ root: classes.tableCell }} numeric padding="none">
                                        0.00
                                    </TableCell>
                                </TableRow>
                            })}

                        </TableBody>
                    </Table>
                </Fragment>
        )(this.props)

    }
)
