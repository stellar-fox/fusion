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
import {
    getDemoAccountIds,
    getSigningMethodsForDemoAccount,
} from "../../lib/logic/stellarAccount"
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
            getSigningMethodsForDemoAccount(this.props.stellarAccounts, accountId)
                .map((signingMethod) =>
                    <div key={`${accountId}-${signingMethod}`} style={{
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
                getSigningMethodsForDemoAccount(
                    this.props.stellarAccounts,
                    source
                )
            )
            this.props.showModalPay()
        }


        // ...
        render = () => (
            ({ demoAccountIds, classes }) =>
                <Fragment>

                    <Typography style={{ padding: "1rem 0 0 0" }} variant="h4">
                        Total for all accounts
                    </Typography>
                    <Typography style={{ padding: "0 0 1rem 0" }} variant="h5">
                        $1,234,567.89
                    </Typography>


                    {demoAccountIds.length > 0 &&
                    <Table classes={{ root: classes.table }}>
                        <TableHead>
                            <TableRow classes={{ root: classes.tableHead }}>
                                <TableCell classes={{ root: classes.tableCellHead }} padding="none">Account Name</TableCell>
                                <TableCell classes={{ root: classes.tableCellHead }} padding="none" numeric>Available</TableCell>
                                <TableCell classes={{ root: classes.tableCellHead }} padding="none" numeric>Balance</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {demoAccountIds.map((accountId) => {
                                return <TableRow key={accountId} onClick={this.showModal(accountId)} classes={{ root: classes.tableRow }}>
                                    <TableCell classes={{ root: classes.tableCell }} padding="none">
                                        <div className="flex-box-row">
                                            {this.bar(accountId)}
                                            <div className="flex-box-col">
                                                <div>No name</div>
                                                <div>{string.shorten(accountId, 11, string.shorten.MIDDLE, "-")}</div>
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
                    }
                </Fragment>
        )(this.props)

    }
)
