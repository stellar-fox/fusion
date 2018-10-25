import React, { Component, Fragment } from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
import { compose } from "redux"
import { connect } from "react-redux"
import { withDynamicRoutes, withStaticRouter } from "../FusionRouter"
import { withStyles } from "@material-ui/core/styles"
import { env } from "../Fusion"
import {
    Divider, Drawer, Hidden, IconButton, Typography
} from "@material-ui/core"
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft"
import {
    ActionItems, DashboardItems, ManagementItems
} from "./DashboardDrawerItems"
import logo from "../Fusion/static/logo.svg"
import withWidth, { isWidthDown } from "@material-ui/core/withWidth"




// <DashboardDrawer> component
export default compose(
    withStyles((theme) => ({

        appLogo: {
            ...theme.fusion.appLogo,
            [theme.breakpoints.up("md")]: {},
            [theme.breakpoints.down("sm")]: {
                margin: "0 0.5em",
            },
        },

        drawerPaper: {
            overflowX: "hidden",
            position: "relative",
            whiteSpace: "nowrap",
            width: env.drawerWidth,
            transition: theme.transitions.create("width", {
                easing: theme.transitions.easing.easeIn,
                duration: theme.transitions.duration.enteringScreen,
            }),
        },

        drawerPaperClose: {
            overflowX: "hidden",
            transition: theme.transitions.create("width", {
                easing: theme.transitions.easing.easeIn,
                duration: theme.transitions.duration.leavingScreen,
            }),
            width: theme.spacing.unit * 7,
            [theme.breakpoints.up("sm")]: {
                width: theme.spacing.unit * 9,
            },
        },

        paperRoot: {
            backgroundColor: theme.palette.custom.arsenic,
            color: theme.palette.primary.contrastText,
        },

        toolbar: {
            [theme.breakpoints.up("md")]: {
                justifyContent: "flex-end",
                padding: "0 8px",
            },
            [theme.breakpoints.down("sm")]: {
                justifyContent: "space-between",
                padding: "0 5px",
            },
            display: "flex",
            alignItems: "center",
            ...theme.mixins.toolbar,
        },

    })),
    withStaticRouter,
    withDynamicRoutes,
    withWidth(),
    connect(
        // map state to props.
        (state) => ({
            currentView: state.Router.currentView,
        })
    )
)(
    class extends Component {

        // ...
        static propTypes = {
            classes: PropTypes.object.isRequired,
            currentPath: PropTypes.string.isRequired,
            open: PropTypes.bool.isRequired,
            staticRouter: PropTypes.object.isRequired,
        }


        // ...
        handleItemClick = (viewName) => {
            if (
                !this.props
                    .currentPath
                    .startsWith(
                        this.props
                            .staticRouter
                            .getPath(viewName)
                    )
            ) {
                this.props.staticRouter.pushByView(viewName)
                isWidthDown("sm", this.props.width) &&
                    this.props.handleDrawerClose()
            }
        }


        // ...
        render = () => (
            ({ classes, open, handleDrawerClose, currentView }) => <Fragment>
                <Hidden smDown>
                    <Drawer
                        variant="permanent"
                        classes={{
                            paper: classNames(
                                classes.drawerPaper,
                                !open && classes.drawerPaperClose
                            ),
                        }}
                        open={open}
                        PaperProps={{ classes: { root: classes.paperRoot } }}
                    >
                        <div className={classes.toolbar}>
                            <IconButton className={
                                classNames(classes.paperRoot)
                            } onClick={handleDrawerClose}
                            >
                                <ChevronLeftIcon />
                            </IconButton>
                        </div>
                        <Divider />
                        <ActionItems itemClick={this.handleItemClick}
                            selectedItem={currentView}
                        />
                        <Divider />
                        <DashboardItems itemClick={this.handleItemClick}
                            selectedItem={currentView}
                        />
                        <Divider />
                        <ManagementItems itemClick={this.handleItemClick}
                            selectedItem={currentView}
                        />
                    </Drawer>
                </Hidden>
                <Hidden smUp>
                    <Drawer
                        classes={{ paper: classNames(classes.drawerPaper) }}
                        open={open}
                        PaperProps={{ classes: { root: classes.paperRoot } }}
                    >
                        <div className={classes.toolbar}>
                            <div className="flex-box-row items-centered">
                                <img
                                    className={classes.appLogo}
                                    src={logo} alt="logo"
                                />
                                <div className="flex-box-col">
                                    <Typography variant="h6">
                                        {env.appVisName}
                                    </Typography>
                                    <div className="text-overline yellow-dark">
                                        v.{env.appVersion}
                                    </div>
                                </div>
                            </div>
                            <div className={classes.toolbar}>
                                <IconButton className={
                                    classNames(classes.paperRoot)
                                } onClick={handleDrawerClose}
                                >
                                    <ChevronLeftIcon />
                                </IconButton>
                            </div>
                        </div>
                        <Divider />
                        <ActionItems itemClick={this.handleItemClick}
                            selectedItem={currentView}
                        />
                        <Divider />
                        <DashboardItems itemClick={this.handleItemClick}
                            selectedItem={currentView}
                        />
                        <Divider />
                        <ManagementItems itemClick={this.handleItemClick}
                            selectedItem={currentView}
                        />
                    </Drawer>
                </Hidden>
            </Fragment>
        )(this.props)

    }
)
