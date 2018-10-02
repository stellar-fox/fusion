import React, { Component } from "react"
import { bindActionCreators, compose } from "redux"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import { withStyles } from "@material-ui/core/styles"
import Avatar from "@material-ui/core/Avatar"
import { gravatarBase } from "../../components/Fusion/env"
import md5 from "../../lib/md5"
import classNames from "classnames"


// <COMPONENT_NAME> component
export default compose(
    withStyles({
        avatar: {
            border: "1px solid rgba(255,255,255,0.3)",
        },
        square: {
            borderRadius: 3,
        },
    }),
    connect(
        (_state) => ({}),
        (dispatch) => bindActionCreators({}, dispatch)
    )
)(
    class extends Component {

        // ...
        static propTypes = {
            classes: PropTypes.object.isRequired,
            email: PropTypes.string.isRequired,
        }


        // ...
        render = () => (
            ({ classes, email, size, variant, }) =>
                <Avatar
                    style={{ margin: "10", width: size || 40,
                        height: size || 40, }}
                    alt="Avatar"
                    className={classNames(classes.avatar, classes[variant])}
                    src={`${gravatarBase}${md5(email)}${size ?
                        ("?s=" + size) : ""}`}
                />
        )(this.props)

    }
)
