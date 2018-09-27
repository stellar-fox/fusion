import React, { Component } from "react"
import { bindActionCreators, compose } from "redux"
import { connect } from "react-redux"
import { withStyles } from "@material-ui/core/styles"
import { Redirect, Route } from "react-router-dom"
import { IconButton, Paper, Snackbar, Typography } from "@material-ui/core"
import { Close } from "@material-ui/icons"
import { ConnectedSwitch as Switch, resolvePath } from "../FusionRouter"
import { Motion, presets, spring } from "react-motion"



// <KeyManagement> component
export default compose(
    withStyles((theme) => ({
        close: {
            width: theme.spacing.unit * 4,
            height: theme.spacing.unit * 4,
        },

        emoji: {
            fontSize: "2rem",
            lineHeight: "3rem",
            verticalAlign: "middle",
        },

        paperCanvas: {
            padding: "10px",
        },

    })),
    connect(
        // map state to props.
        (state) => ({
            Auth: state.Auth,
        }),
        // match dispatch to props.
        (dispatch) => bindActionCreators({}, dispatch)
    )
)(
    class extends Component {

        // ...
        constructor(props) {
            super(props)

            // relative resolve
            this.rr = resolvePath(this.props.match.path)
        }

        state = {
            open: false,
        }

        // ...
        popupSnackbar = (message) => this.setState({
            open: true,
            message,
        })

        // ...
        closeSnackbar = () => this.setState({ open: false, })


        // ...
        render = () => (
            ({ classes, Auth, }) =>
                <Switch>
                    <Route exact path={this.rr(".")}>

                        <Paper className={classes.paperCanvas}>

                            <Snackbar
                                anchorOrigin={{
                                    vertical: "bottom",
                                    horizontal: "left",
                                }}
                                open={this.state.open}
                                autoHideDuration={3000}
                                onClose={this.closeSnackbar}
                                ContentProps={{
                                    "aria-describedby": "message-id",
                                }}
                                message={
                                    <span id="message-id">
                                        <Typography variant="body2" color="inherit">
                                            {this.state.message}
                                        </Typography>
                                    </span>
                                }
                                action={[
                                    <IconButton
                                        key="close"
                                        aria-label="Close"
                                        color="inherit"
                                        className={classes.close}
                                        onClick={this.closeSnackbar}
                                    >
                                        <Close />
                                    </IconButton>,
                                ]}
                            />

                            <Typography variant="display1">
                                User: {Auth.uid}
                            </Typography>
                            <Typography variant="display1">
                                Email: {Auth.email} {Auth.emailVerified && "(verified)"}
                            </Typography>
                            <br />


                            <Motion defaultStyle={{ x: -10, }}
                                style={{ x: spring(5, presets.gentle), }}
                            >
                                {value =>
                                    <Typography style={{
                                        position: "relative",
                                        WebkitTransform: `translate(${value.x}px, 0)`,
                                        transform: `translate(${value.x}px, 0)`,
                                    }} variant="title"
                                    >
                                        Key Management
                                    </Typography>
                                }
                            </Motion>

                        </Paper>

                    </Route>
                    <Redirect to={this.rr(".")} />
                </Switch>
        )(this.props)

    }
)
