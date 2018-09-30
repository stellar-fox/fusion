import React, { Component } from "react"
import PropTypes from "prop-types"
import { compose } from "redux"
import { connect } from "react-redux"
import { Redirect, Route } from "react-router-dom"
import {
    ConnectedSwitch as Switch,
    resolvePath,
    withStaticRouter,
} from "../FusionRouter"
import { withStyles } from "@material-ui/core/styles"
import KeyManagement from "../KeyManagement"
import Balances from "../Balances"
import Transactions from "../Transactions"
import UserAccount from "../UserAccount"
import Contacts from "../Contacts"




// <DashboardContent> component
export default compose(
    withStyles({

        dashboardContent: {
            // JSS
            // rules
            // here
        },

    }),
    withStaticRouter,
    connect(
        // map state to props.
        (_state) => ({ })
    )
)(
    class extends Component {

        // ...
        static propTypes = {
            classes: PropTypes.object.isRequired,
            match: PropTypes.object.isRequired,
            staticRouter: PropTypes.object.isRequired,
        }


        // ...
        constructor (props) {
            super(props)

            // relative resolve
            this.rr = resolvePath(this.props.match.path)

            // static paths
            this.props.staticRouter.addPaths({
                "keys": this.rr("keys/"),
                "balances": this.rr("balances/"),
                "transactions": this.rr("transactions/"),
                "account": this.rr("account/"),
                "contacts": this.rr("contacts/"),
            })
        }


        // ...
        render = () => (
            ({ classes, staticRouter: { getPath, }, }) =>
                <div className={classes.dashboardContent}>
                    <Switch>
                        <Redirect exact
                            from={this.rr(".")}
                            to={getPath("keys")}
                        />
                        <Route path={getPath("keys")}>
                            { (routeProps) => <KeyManagement {...routeProps} /> }
                        </Route>
                        <Route path={getPath("balances")}>
                            { (routeProps) => <Balances {...routeProps} /> }
                        </Route>
                        <Route path={getPath("transactions")}>
                            {(routeProps) => <Transactions {...routeProps} />}
                        </Route>
                        <Route path={getPath("account")}>
                            {(routeProps) => <UserAccount {...routeProps} />}
                        </Route>
                        <Route path={getPath("contacts")}>
                            {(routeProps) => <Contacts {...routeProps} />}
                        </Route>
                        <Redirect to={getPath("keys")} />
                    </Switch>
                </div>
        )(this.props)

    }
)
