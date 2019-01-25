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
import { detectAccount } from "../../actions/stellarAccount"
import { detectSigningMethod } from "../../actions/signingMethods"
import MainContent from "./MainContent"
import ModalCreateAccount from "./ModalCreateAccount"
import ModalEditName from "./ModalEditName"
import Snacky from "../../lib/mui-v1/Snacky"
import Fade from "@material-ui/core/Fade"




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
            height: state.App.dim.height,
            tabSelected: state.Accounts.tabSelected,
            realAccounts: getRealAccounts(state.StellarAccounts),
            demoAccounts: getDemoAccounts(state.StellarAccounts),
            loading: state.Awaiter.loading,
            uid: state.Auth.uid,
        }),
        // match dispatch to props.
        (dispatch) => bindActionCreators({
            changeTab: AccountsActions.changeTab,
            detectAccount,
            detectSigningMethod,
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
        render = () => (
            ({ classes, height, loading }) => {

                return <Switch>
                    <Route exact path={this.rr(".")}>
                        {loading ? <div className={classes.awaiter}>
                            <Awaiter />
                        </div> : <Fragment>
                            <ModalCreateAccount />
                            <ModalEditName />
                            <Fade in={true} timeout={{
                                enter: 700,
                                exit: 300,
                            }}
                            >
                                <Paper style={{
                                    height: height - 90,
                                }} className={classes.paperCanvas}
                                >
                                    <MainContent />
                                </Paper>
                            </Fade>
                            <Snacky />
                        </Fragment>
                        }
                    </Route>
                    <Redirect to={this.rr(".")} />
                </Switch>
            })(this.props)

    }
)
