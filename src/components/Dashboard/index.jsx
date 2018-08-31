import React, { Component } from "react"
import PropTypes from "prop-types"
import { compose } from "redux"
import { connect } from "react-redux"
import { withStyles } from "@material-ui/core/styles"
import { Hidden } from "@material-ui/core"
import { env } from "../Fusion"
import DashboardContent from "./DashboardContent"
import AppBar from "../AppBar"
import "./index.css"




// <Dashboard> component
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
            padding: theme.spacing.unit * 1.5,
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
        // map state to props.
        (_state) => ({})
    )
)(
    class extends Component {

        // ...
        static propTypes = {
            classes: PropTypes.object.isRequired,
        }


        // ...
        render = () => (
            ({ classes, }) =>
                <div className={classes.root}>

                    <Hidden smDown>
                        <AppBar />
                    </Hidden>

                    <main className={classes.content}>
                        <div className={classes.toolbar} />
                        <DashboardContent />
                    </main>

                </div>
        )(this.props, this.state)

    }
)
