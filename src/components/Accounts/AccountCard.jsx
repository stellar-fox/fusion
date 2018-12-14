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
import { func, shorten } from "@xcmats/js-toolbox"
import { accountType as at } from "../../redux/Accounts"



// <AccountCard> component
export default compose(
    withStyles((theme) => ({
        actions: {
            display: "flex",
        },
        avatarDemo: {
            backgroundColor: theme.palette.error.main,
            opacity: "0.5",
        },
        avatarReal: {
            backgroundColor: theme.palette.custom.green,
            opacity: "0.5",
        },
        card: {
            backgroundColor: theme.palette.custom.outerSpace,
        },
        cardDemo: {

        },
        cardReal: {

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
        (_state) => ({}),
        (dispatch) => bindActionCreators({}, dispatch)
    )
)(
    class extends Component {

        // ...
        static propTypes = {
            classes: PropTypes.object.isRequired,
        }


        // ...
        render = () => (
            ({ accountId, accountType, classes }) =>
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
                            />
                        }
                        action={
                            <IconButton style={{ marginLeft: "1rem" }} aria-label="Edit"
                                classes={{ root: func.choose(accountType, {
                                    [at.REAL]: () => classes.iconButtonReal,
                                    [at.DEMO]: () => classes.iconButtonDemo,
                                }, () => "unknown account type") }}
                            >
                                <EditRounded />
                            </IconButton>
                        }
                        title="No Name"
                        subheader={accountId && shorten(accountId, 11, shorten.MIDDLE, "-")}
                    />
                    <CardContent>
                        <Typography variant="h4">
                            Current Balance
                        </Typography>
                        <Typography variant="h5">
                            $1,234,567.89
                        </Typography>
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
                    </CardActions>
                </Card>
        )(this.props)

    }
)
