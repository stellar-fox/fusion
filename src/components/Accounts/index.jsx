import React, { Component, Fragment } from "react"
import { bindActionCreators, compose } from "redux"
import { connect } from "react-redux"
import { withStyles } from "@material-ui/core/styles"
import { Redirect, Route } from "react-router-dom"
import withWidth from "@material-ui/core/withWidth"
import { Paper } from "@material-ui/core"
import { ConnectedSwitch as Switch, resolvePath } from "../FusionRouter"
import { action as AccountsActions } from "../../redux/Accounts"
import {
    getDemoAccounts,
    getRealAccounts,
} from "../../lib/logic/stellarAccount"
import Awaiter from "../Awaiter"

import { listenForStellarAccountsChange } from "../../actions/stellarAccount"
import { listenForSigningMethodsChange } from "../../actions/signingMethods"
import ModalEditName from "./ModalEditName"
import Snacky from "../../lib/mui-v1/Snacky"
import MainContent from "./MainContent"




// <Accounts> component
export default compose(
    withStyles((_theme) => ({

        awaiter: {
            position: "absolute",
            left: 0,
            top: "50%",
            bottom: 0,
            right: 0,
            margin: "auto",
        },

        paperCanvas: {
            padding: "10px",
        },

    })),
    connect(
        // map state to props.
        (state) => ({
            tabSelected: state.Accounts.tabSelected,
            realAccounts: getRealAccounts(state.StellarAccounts),
            demoAccounts: getDemoAccounts(state.StellarAccounts),
            loading: state.Awaiter.loading,
            uid: state.Auth.uid,
        }),
        // match dispatch to props.
        (dispatch) => bindActionCreators({
            changeTab: AccountsActions.changeTab,
            listenForSigningMethodsChange,
            listenForStellarAccountsChange,
        }, dispatch)
    ),
    withWidth(),
)(
    class extends Component {

        // ...
        constructor (props) {
            super(props)

            // relative resolve
            this.rr = resolvePath(this.props.match.path)
        }


        // ...
        componentDidMount = () => {
            this.props.listenForStellarAccountsChange(this.props.uid)
            this.props.listenForSigningMethodsChange(this.props.uid)
        }


        // ...
        render = () => (
            ({ classes, loading }) => {

                return <Switch>
                    <Route exact path={this.rr(".")}>
                        {loading ? <div className={classes.awaiter}>
                            <Awaiter />
                        </div> : <Fragment>
                            <Snacky />
                            <ModalEditName />
                            <Paper className={classes.paperCanvas}>
                                <MainContent />
                            </Paper>
                        </Fragment>
                        }
                    </Route>
                    <Redirect to={this.rr(".")} />
                </Switch>
            })(this.props)

    }
)
