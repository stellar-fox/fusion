import React, { Component, Fragment } from "react"
import { bindActionCreators, compose } from "redux"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import { withStyles } from "@material-ui/core/styles"
import VerifyEmail from "./VerifyEmail"
import ResetPassword from "./ResetPassword"
import queryString from "query-string"
import { action as AuthActions } from "../../redux/Auth"




// <FirebaseActions> component
export default compose(
    withStyles((_theme) => ({

    })),
    connect(
        (_state) => ({
        }),
        (dispatch) => bindActionCreators({
            processVerificationLink: AuthActions.processVerificationLink,
            processPasswordResetLink: AuthActions.processPasswordResetLink,
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
            this.qs.mode === "resetPassword" &&
                this.props.processPasswordResetLink(this.qs)
        }


        // Parsed query-string from URI.
        qs = queryString.parse(
            this.props.location.search,
            { ignoreQueryPrefix: true, }
        )


        // ...
        render = () =>
            <Fragment>
                {this.qs.mode === "verifyEmail" && <VerifyEmail continueUrl={this.qs.continueUrl} />}
                {this.qs.mode === "resetPassword" && <ResetPassword oobCode={this.qs.oobCode} continueUrl={this.qs.continueUrl} />}
            </Fragment>
    }
)
