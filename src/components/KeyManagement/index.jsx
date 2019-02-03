import React, { Component, Fragment } from "react"
import { bindActionCreators, compose } from "redux"
import { connect } from "react-redux"
import { withStyles } from "@material-ui/core/styles"
import { Redirect, Route } from "react-router-dom"
import { Paper, Typography } from "@material-ui/core"
import { ConnectedSwitch as Switch, resolvePath } from "../FusionRouter"
import ShambhalaPureCard from "./ShambhalaPureCard"
import ShambhalaLedgerCard from "./ShambhalaLedgerCard"
import ShambhalaScepticCard from "./ShambhalaScepticCard"
import withWidth, { isWidthDown } from "@material-ui/core/withWidth"
import Snacky from "../../lib/mui-v1/Snacky"
import Fade from "@material-ui/core/Fade"




// <KeyManagement> component
export default compose(
    withStyles((_theme) => ({
        paperCanvas: {
            padding: "10px",
        },

    })),
    connect(
        // map state to props.
        (_state) => ({}),
        // match dispatch to props.
        (dispatch) => bindActionCreators({}, dispatch)
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
            ({ classes, width }) => <Switch><Route exact path={this.rr(".")}>
                        
                <Fade in timeout={{ enter: 700, exit: 300 }}>
                    <Paper className={classes.paperCanvas}>
                        <Snacky />
                        
                        <Fragment>
                            <Typography variant="h6">
                                Key Management
                            </Typography>
                            <Typography variant="h4">
                                Manage additional keys with your account.
                            </Typography>
                            <div style={{
                                position: "relative",
                            }} className={isWidthDown("md", width) ?
                                "m-t m-b flex-box-col items-centered" :
                                "m-t m-b flex-box-row space-around"}
                            >
                                <ShambhalaPureCard />

                                {isWidthDown("md", width) &&
                                    <div className="m-b"></div>}

                                <ShambhalaLedgerCard />

                                {isWidthDown("md", width) &&
                                    <div className="m-b"></div>}

                                <ShambhalaScepticCard />
                            </div>
                        </Fragment>
                            
                    </Paper>
                </Fade>
            </Route>
            <Redirect to={this.rr(".")} />
            </Switch>
        )(this.props)

    }
)
