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
import {
    setAccountType,
    setSource,
    showModalPay,
} from "../../actions/payment"
import { getDemoAccountIds } from "../../lib/logic/stellarAccount"
import { signingMethods } from "../../lib/logic/signingMethods"
import { action as PayActions } from "../../redux/Pay"
import { accountType as at } from "../../redux/Accounts"




// <RosterDemo> component
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
        tableCellHead: {
            borderBottom: `1px solid ${theme.palette.custom.darkGunmetal} !important`,
        },
        tableHead: {
            height: 32,
        },
        tableRow: {
            cursor: "pointer",
            borderBottom: `1px solid ${theme.palette.custom.darkGunmetal} !important`,
            "&:last-child": {
                borderBottom: "none !important",
                borderTop: "none !important",
            },
        },
    })),
    connect(
        (state) => ({
            demoAccountIds: getDemoAccountIds(state.StellarAccounts),
            signingMethods: state.SigningMethods,
            stellarAccounts: state.StellarAccounts,
        }),
        (dispatch) => bindActionCreators({
            setAvailableSigningMethods: PayActions.setAvailableSigningMethods,
            setAccountType,
            setSource,
            showModalPay,
        }, dispatch)
    )
)(
    class extends Component {

        // ...
        static propTypes = {
            classes: PropTypes.object.isRequired,
        }


        // ...
        bar = (accountId) =>
            Object.keys(signingMethods(this.props.signingMethods, accountId))
                .map((signingMethod) =>
                    <div key={`demo-${accountId}-${signingMethod}`} style={{
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
                )


        // ...
        showModal = (source) => (_event) => {
            this.props.setSource(source)
            this.props.setAccountType(at.DEMO)
            this.props.setAvailableSigningMethods(
                Object.keys(signingMethods(
                    this.props.signingMethods,
                    source
                ))
            )
            this.props.showModalPay()
        }


        // ...
        render = () => (
            ({ classes, demoAccountIds, stellarAccounts }) =>
                demoAccountIds.length === 0 ? <div
                    className="flex-box-col items-centered content-centered"
                    style={{
                        marginTop: "10%",
                        opacity: 0.3,
                    }}
                >
                    <Typography variant="h1">
                        You have no real accounts at the moment.
                    </Typography>
                    <Typography variant="h4">
                        Please create a real account first in order to view the balance roster.
                    </Typography>
                </div> :
                    <Fragment>
                        <Typography style={{ padding: "1rem 0 0 0" }} variant="h4">
                            Total for all accounts
                        </Typography>
                        <Typography style={{ padding: "0 0 1rem 0" }} variant="h5">
                            $1,234,567.89
                        </Typography>
                        <Table classes={{ root: classes.table }}>
                            <TableHead>
                                <TableRow classes={{ root: classes.tableHead }}>
                                    <TableCell classes={{ root: classes.tableCellHead }} padding="none">Account Name</TableCell>
                                    <TableCell classes={{ root: classes.tableCellHead }} padding="none" align="right">Available</TableCell>
                                    <TableCell classes={{ root: classes.tableCellHead }} padding="none" align="right">Balance</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {demoAccountIds.map((accountId) => {
                                    return <TableRow key={accountId} onClick={this.showModal(accountId)} classes={{ root: classes.tableRow }}>
                                        <TableCell classes={{ root: classes.tableCell }} padding="none">
                                            <div className="flex-box-row">
                                                {this.bar(accountId)}
                                                <div className="flex-box-col">
                                                    <div>{stellarAccounts[accountId].name || "No Name"}</div>
                                                    <div>{string.shorten(accountId, 11, string.shorten.MIDDLE, "-")}</div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell classes={{ root: classes.tableCell }} align="right" padding="none">
                                            0.00
                                        </TableCell>
                                        <TableCell classes={{ root: classes.tableCell }} align="right" padding="none">
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
