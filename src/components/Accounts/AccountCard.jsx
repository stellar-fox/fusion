import React, { Component } from "react"
import { bindActionCreators, compose } from "redux"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import { withStyles } from "@material-ui/core/styles"
import {
    Avatar,
    Card,
    CardHeader,
    CardContent,
    CardActions,
    IconButton,
    Typography,
} from "@material-ui/core"
import classnames from "classnames"

import {
    EditRounded,
    AccountBalanceWalletRounded,
    PaymentRounded,
} from "@material-ui/icons"
import {
    func,
    last,
    shorten,
} from "@xcmats/js-toolbox"
import { Sparklines, SparklinesLine, SparklinesReferenceLine } from "react-sparklines"
import { accountType as at } from "../../redux/Accounts"
import { showEditNameModal } from "../../actions/setAccountName"




// <AccountCard> component
export default compose(
    withStyles((theme) => ({
        actions: {
            display: "flex",
        },
        avatarDemo: {
            backgroundColor: theme.palette.error.main,
            opacity: "0.5",
            fontFamily: "'Roboto Condensed', sans-serif",
        },
        avatarReal: {
            backgroundColor: theme.palette.custom.green,
            opacity: "0.5",
        },
        card: {
            backgroundColor: theme.palette.custom.outerSpace,
        },
        cardContent: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
        },
        cardDemo: {

        },
        cardReal: {

        },
        cardSubheader: {
            fontSize: "0.5rem",
        },
        iconButtonDemo: {
            color: theme.palette.error.main,
            opacity: "0.75",
        },
        iconButtonReal: {
            color: theme.palette.custom.green,
            opacity: "0.75",
        },

    })),
    connect(
        (state) => ({
            stellarAccounts: state.StellarAccounts,
        }),
        (dispatch) => bindActionCreators({
            showEditNameModal,
        }, dispatch)
    )
)(
    class extends Component {

        // ...
        static propTypes = {
            classes: PropTypes.object.isRequired,
        }


        // ...
        handleEditNameButtonClick = () => {
            this.props.showEditNameModal(this.props.accountId)
        }


        // ...
        renderBalance = (stellarAccount) =>
            <Typography variant="body1">
                {stellarAccount.nativeBalance ?
                    stellarAccount.nativeBalance.balance : "0"
                } <span style={{ fontSize: "0.7rem" }}>XLM</span>
            </Typography>


        // ...
        render = () => (
            ({ accountId, accountType, classes, stellarAccounts }) =>
                <Card className={classnames(func.choose(accountType, {
                    [at.REAL]: () => classes.cardReal,
                    [at.DEMO]: () => classes.cardDemo,
                }, () => "unknown account type"), classes.card)}
                >
                    <CardHeader
                        avatar={
                            <Avatar aria-label="Account Type"
                                className={func.choose(accountType, {
                                    [at.REAL]: () => classes.avatarReal,
                                    [at.DEMO]: () => classes.avatarDemo,
                                }, () => "unknown account type")}
                            >{last(accountId)}</Avatar>
                        }
                        action={
                            <IconButton style={{ margin: "0" }} aria-label="Edit"
                                classes={{ root: func.choose(accountType, {
                                    [at.REAL]: () => classes.iconButtonReal,
                                    [at.DEMO]: () => classes.iconButtonDemo,
                                }, () => "unknown account type") }}
                                onClick={this.handleEditNameButtonClick}
                            >
                                <EditRounded />
                            </IconButton>
                        }
                        classes={{ subheader: classes.cardSubheader }}
                        title={stellarAccounts[accountId].name || "No Name"}
                        subheader={accountId && shorten(accountId, 11, shorten.MIDDLE, "-")}
                    />
                    <CardContent classes={{ root: classes.cardContent }}>
                        <div>
                            <Typography variant="subtitle1">
                                Current Balance
                            </Typography>
                            {this.renderBalance(stellarAccounts[accountId])}
                        </div>

                    </CardContent>

                    <CardActions className={classes.actions} disableActionSpacing>
                        <IconButton aria-label="Pay"
                            classes={{ root: func.choose(accountType, {
                                [at.REAL]: () => classes.iconButtonReal,
                                [at.DEMO]: () => classes.iconButtonDemo,
                            }, () => "unknown account type") }}
                        >
                            <PaymentRounded />
                        </IconButton>
                        <IconButton aria-label="Fund"
                            classes={{ root: func.choose(accountType, {
                                [at.REAL]: () => classes.iconButtonReal,
                                [at.DEMO]: () => classes.iconButtonDemo,
                            }, () => "unknown account type") }}
                        >
                            <AccountBalanceWalletRounded />
                        </IconButton>
                        <div style={{ marginLeft: "1rem", width: 80 }}>
                            <Sparklines data={[5, 40, 35, 10, 15, 9, 20, 28, 30, 28, 20, 25]}>
                                <SparklinesLine style={{ stroke: "#8ed53f", strokeWidth: "2", fill: "#8fc638", fillOpacity: "0.2" }} />
                                <SparklinesReferenceLine type="mean" style={{ stroke: "white", strokeOpacity: "0.9", strokeDasharray: "2, 2" }} />
                            </Sparklines>
                        </div>
                    </CardActions>
                </Card>
        )(this.props)

    }
)
