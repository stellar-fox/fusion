import React, { Component, Fragment } from "react"
import { bindActionCreators, compose } from "redux"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import { withStyles, Typography } from "@material-ui/core"
import TextInput from "../../lib/mui-v1/TextInput"
import withWidth, { isWidthDown } from "@material-ui/core/withWidth"
import { emptyString } from "@xcmats/js-toolbox"
import { htmlEntities as he } from "../../lib/utils"



// <Profile> component
export default compose(
    withStyles({

    }),
    connect(
        (state) => ({
            email: state.Auth.email,
            emailVerified: state.Auth.emailVerified,
        }),
        (dispatch) => bindActionCreators({}, dispatch)
    ),
    withWidth(),
)(
    class extends Component {

        // ...
        static propTypes = {
            classes: PropTypes.object.isRequired,
        }


        // ...
        state = {
            email: emptyString(),
            emailVerified: false,
            name: emptyString(),
        }


        // ...
        componentDidMount = () => {
            this.setState({
                email: this.props.email,
                emailVerified: this.props.emailVerified,
            })
        }


        // ...
        setEmail = (e) => this.setState({
            email: e.target.value,
            emailVerified: e.target.value === this.props.email,
        })


        // ...
        setName = (e) => this.setState({
            name: e.target.value,
        })


        // ...
        render = () => (
            ({ classes, width, }) =>
                <Fragment>
                    <Typography variant="subheading">
                        Manage user profile data here.
                    </Typography>

                    <div className="flex-box-row items-centered">
                        <TextInput
                            id="email"
                            label="Email"
                            type="text"
                            lighter
                            fullWidth={isWidthDown("sm", width)}
                            value={this.state.email}
                            onChange={this.setEmail}
                            autocomplete={false}
                            error={this.state.errorEmail}
                            errorMessage={this.state.errorMessageEmail}
                        />
                        {this.state.emailVerified &&
                        <Fragment>
                            <he.Nbsp />
                            <Typography variant="display1">
                                (verified)
                            </Typography>
                        </Fragment>
                        }
                    </div>
                    <div className="flex-box-row">
                        <TextInput
                            id="name"
                            label="Name"
                            type="text"
                            lighter
                            fullWidth={isWidthDown("sm", width)}
                            value={this.state.name}
                            onChange={this.setName}
                            autocomplete={false}
                            error={this.state.errorName}
                            errorMessage={this.state.errorMessageName}
                        />
                    </div>

                </Fragment>
        )(this.props)

    }
)
