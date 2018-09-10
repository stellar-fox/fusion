import React, { Component, Fragment } from "react"
import PropTypes from "prop-types"
import { bindActionCreators, compose } from "redux"
import { connect } from "react-redux"
import { withStyles } from "@material-ui/core/styles"
import {
    AppBar, Hidden, IconButton, Toolbar, Typography,
} from "@material-ui/core"
import MenuIcon from "@material-ui/icons/Menu"
import UserMenu from "../../lib/mui-v1/UserMenu"
import TabBar from "../../lib/mui-v1/TabBar"
import DashboardDrawer from "../Dashboard/DashboardDrawer"
import classNames from "classnames"
import logo from "../Fusion/static/logo.svg"
import { env } from "../Fusion"



// <AppBar> component
export default compose(
    withStyles((theme) => ({

        appBar: {
            zIndex: theme.zIndex.drawer + 1,
            transition: theme.transitions.create(["width", "margin",], {
                easing: theme.transitions.easing.easeIn,
                duration: theme.transitions.duration.leavingScreen,
            }),
        },

        appBarShift: {
            marginLeft: env.drawerWidth,
            width: `calc(100% - ${env.drawerWidth}px)`,
            transition: theme.transitions.create(["width", "margin",], {
                easing: theme.transitions.easing.easeIn,
                duration: theme.transitions.duration.enteringScreen,
            }),
        },

        toolbarRoot: {
            display: "block",
        },

        appLogo: {
            ...theme.fusion.appLogo,
            marginRight: 36,
        },

        appLogoSm: {
            ...theme.fusion.appLogoSm,
            margin: "0 1em 0 0.75em",
        },

        menuButton: {
            marginLeft: 12,
            marginRight: 36,
        },

        hide: { display: "none", },

        iconButtonShift: { marginRight: 12, },

        version: {
            fontSize: "0.7rem",
            color: "white",
        },

        caption: {
            color: theme.palette.secondary.faded,
        },

    })),
    connect(
        (state) => ({
            authenticated: !!state.Auth.authToken,
        }),
        (dispatch) => bindActionCreators({}, dispatch)
    )
)(
    class extends Component {

        // ...
        static propTypes = {
            classes: PropTypes.object.isRequired,
            authenticated: PropTypes.bool.isRequired,
        }


        // ...
        state = { open: false, }


        // ...
        handleDrawerOpen = () => this.setState({ open: true, })


        // ...
        handleDrawerClose = () => this.setState({ open: false, })


        // ...
        render = () => (
            ({ classes, authenticated, }, { open, }) =>
                <Fragment>
                    <Hidden smDown>
                        <AppBar
                            position="absolute"
                            className={
                                classNames(
                                    classes.appBar,
                                    open && classes.appBarShift
                                )
                            }
                        >
                            <Toolbar
                                disableGutters={!open}
                            >
                                <IconButton
                                    color="secondary"
                                    aria-label="open drawer"
                                    onClick={this.handleDrawerOpen}
                                    className={
                                        classNames(
                                            classes.menuButton,
                                            open && classes.hide
                                        )
                                    }
                                >
                                    <MenuIcon />
                                </IconButton>
                                <div style={{width: "100%",}} className="flex-box-row items-centered">
                                    <img
                                        className={classes.appLogo}
                                        src={logo} alt="logo"
                                    />
                                    <div className="flex-box-col">
                                        <Typography variant="display4">
                                            {env.appVisName}
                                        </Typography>
                                        <div className="text-overline yellow-dark">
                                            v.{env.appVersion}
                                        </div>
                                    </div>
                                </div>

                                <div
                                    className={
                                        classNames(
                                            "flex-box-row items-centered",
                                            classes.menuButton,
                                            open && classes.iconButtonShift
                                        )
                                    }
                                >
                                    {authenticated && <UserMenu />}
                                </div>
                            </Toolbar>
                        </AppBar>

                        <DashboardDrawer
                            open={open}
                            handleDrawerClose={this.handleDrawerClose}
                        />
                    </Hidden>

                    <Hidden mdUp>
                        <AppBar
                            position="absolute"
                            className={classes.appBar}
                        >
                            <Toolbar
                                disableGutters={true}
                                variant="dense"
                                classes={{ root: classes.toolbarRoot, }}
                            >
                                <div className="flex-box-row space-between items-centered">
                                    <div className="flex-box-row items-centered">
                                        <img
                                            className={classes.appLogoSm}
                                            src={logo} alt="logo"
                                        />

                                        <TabBar color="secondary" />

                                    </div>
                                    {authenticated && <UserMenu />}
                                </div>
                            </Toolbar>
                        </AppBar>
                    </Hidden>

                </Fragment>
        )(this.props, this.state)

    }
)
