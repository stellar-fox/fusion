import React, { Component } from "react"
import { bindActionCreators, compose } from "redux"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import { withStyles } from "@material-ui/core/styles"
import Avatar from "@material-ui/core/Avatar"
import classNames from "classnames"


// <PhotoAvatar> component
export default compose(
    withStyles({
        avatar: {
            border: "1px solid rgba(255,255,255,0.1)",
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
            src: PropTypes.string.isRequired,
        }


        // ...
        render = () => (
            ({ classes, src, size, variant }) =>
                <Avatar
                    style={{
                        margin: "10", width: size || 40,
                        height: size || 40,
                    }}
                    alt=""
                    className={classNames(classes.avatar, classes[variant])}
                    src={src}
                />
        )(this.props)

    }
)
