import React, { Component } from "react"
import PropTypes from "prop-types"
import { bindActionCreators, compose } from "redux"
import { connect } from "react-redux"
import { withDynamicRoutes, withStaticRouter } from "../FusionRouter"
import { withStyles } from "@material-ui/core/styles"
import { Tabs, Tab } from "@material-ui/core"
import {
    AccountBalanceWalletRounded, ContactsRounded, VpnKeyRounded
} from "@material-ui/icons"




// <TabBar> component
export default compose(
    withStaticRouter,
    withDynamicRoutes,
    withStyles((theme) => ({
        tabsIndicator: {
            backgroundColor: theme.palette.error.dark,
        },
    })),
    connect(
        (state) => ({
            currentView: state.Router.currentView,
        }),
        (dispatch) => bindActionCreators({}, dispatch)
    )
)(
    class extends Component {

        // ...
        static propTypes = {
            classes: PropTypes.object.isRequired,
            currentPath: PropTypes.string.isRequired,
            staticRouter: PropTypes.object.isRequired,
        }

        // ...
        state = {
            quickAccessList: ["keys", "balances", "contacts",],
        }

        // ...
        selectView = (viewName) => {
            if (
                !this.props
                    .currentPath
                    .startsWith(
                        this.props
                            .staticRouter
                            .getPath(viewName)
                    )
            ) {
                console.info("switching to (from tabbar): " + viewName)
                this.props.staticRouter.pushByView(viewName)
            } else {
                console.log("This view is not mapped to quick access tab")
            }
        }


        // ...
        handleTabChange = (_event, value) => this.selectView(value)


        // ...
        render = () => (
            ({ classes, color, currentView, disabled, }) =>
                <Tabs
                    classes={{
                        indicator: classes.tabsIndicator,
                    }}
                    value={
                        this.state.quickAccessList.includes(currentView) ?
                            currentView : false
                    }
                    onChange={this.handleTabChange}
                >
                    <Tab
                        disabled={disabled}
                        icon={<VpnKeyRounded color={color} />}
                        value="keys"
                    />
                    <Tab
                        disabled={disabled}
                        icon={<AccountBalanceWalletRounded color={color} />}
                        value="balances"
                    />
                    <Tab
                        disabled={disabled}
                        icon={<ContactsRounded color={color} />}
                        value="contacts"
                    />
                </Tabs>
        )(this.props)

    }
)
