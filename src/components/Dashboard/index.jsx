import React, { Component } from "react"
import PropTypes from "prop-types"
import { compose } from "redux"
import { connect } from "react-redux"
import { withStyles } from "@material-ui/core/styles"
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

                    <AppBar />

                    <main className={classes.content}>

                        <div className={classes.toolbar} />

                        <DashboardContent />
                    </main>

                </div>
        )(this.props, this.state)

    }
)
