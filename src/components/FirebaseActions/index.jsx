import React, { Component } from "react"
import { bindActionCreators, compose } from "redux"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import { withStyles } from "@material-ui/core/styles"
import ActionMessage from "./ActionMessage"
import queryString from "query-string"
import { action as AuthActions } from "../../redux/Auth"




// <COMPONENT_NAME> component
export default compose(
    withStyles((_theme) => ({

    })),
    connect(
        (_state) => ({
        }),
        (dispatch) => bindActionCreators({
            processVerificationLink: AuthActions.processVerificationLink,
        }, dispatch)
    )
)(
    class extends Component {

        // ...
        static propTypes = {
            classes: PropTypes.object.isRequired,
        }


        // ...
        componentDidMount = () => {
            this.qs.mode === "verifyEmail" &&
                this.props.processVerificationLink(this.qs)
        }


        // Parsed query-string from URI.
        qs = queryString.parse(
            this.props.location.search,
            { ignoreQueryPrefix: true, }
        )


        // ...
        render = () =>
            <ActionMessage continueUrl={this.qs.continueUrl} />
    }
)
