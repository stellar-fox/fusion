import React, { Component, Fragment } from "react"
import PropTypes from "prop-types"
import {
    bindActionCreators,
    compose,
} from "redux"
import { connect } from "react-redux"
import { withStyles } from "@material-ui/core/styles"
import {
    AppBar,
    IconButton,
    Toolbar,
    Typography,
} from "@material-ui/core"
import MenuIcon from "@material-ui/icons/Menu"
import UserMenu from "../../lib/mui-v1/UserMenu"
import DashboardDrawer from "../Dashboard/DashboardDrawer"
import classNames from "classnames"
import logo from "../Fusion/static/logo.svg"
import { env } from "../Fusion"



// <AppBar> component
export default compose(
    withStyles((theme) => ({

        root: {
            display: "flex",
            flexGrow: 1,
            height: "100%",
            overflow: "hidden",
            position: "relative",
        },

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

        appLogo: {
            ...theme.fusion.appLogo,
            marginRight: 36,
        },

        menuButton: {
            marginLeft: 12,
            marginRight: 36,
        },

        hide: { display: "none", },

        iconButtonShift: { marginRight: 12, },

        toolbar: {
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            padding: "0 8px",
            ...theme.mixins.toolbar,
        },

        content: {
            flexGrow: 1,
            backgroundColor: theme.palette.background.default,
            padding: theme.spacing.unit * 3,
            overflowY: "auto",
        },

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
                                color="inherit"
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
                            <div style={{
                                width: "100%", display: "flex",
                                alignItems: "center",
                            }}
                            >
                                <img
                                    className={classes.appLogo}
                                    src={logo} alt="logo"
                                />
                                <Typography
                                    variant="title"
                                    color="inherit"
                                    noWrap
                                >
                                    {env.appVisName}
                                    <Typography align="center"
                                        variant="caption"
                                        noWrap
                                        classes={{ caption: classes.caption, }}
                                    >
                                        v.{env.appVersion}
                                    </Typography>
                                </Typography>
                            </div>
                            <div
                                className={
                                    classNames(
                                        classes.menuButton,
                                        open && classes.iconButtonShift
                                    )
                                }
                                style={{
                                    display: "flex", alignItems: "center",
                                }}
                            >
                                {authenticated ? <UserMenu /> : null}
                            </div>
                        </Toolbar>
                    </AppBar>

                    <DashboardDrawer
                        open={open}
                        handleDrawerClose={this.handleDrawerClose}
                    />

                </Fragment>
        )(this.props, this.state)

    }
)
