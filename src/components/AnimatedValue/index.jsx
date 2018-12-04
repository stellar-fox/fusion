import React, { Component } from "react"
import { bindActionCreators, compose } from "redux"
import { connect } from "react-redux"
import { withStyles } from "@material-ui/core/styles"
import { Typography } from "@material-ui/core"
import {
    Motion,
    presets,
    spring,
} from "react-motion"
import NumberFormat from "react-number-format"




// <COMPONENT_NAME> component
export default compose(
    withStyles((_theme) => ({

    })),
    connect(
        (_state) => ({}),
        (dispatch) => bindActionCreators({}, dispatch)
    )
)(
    class extends Component {

        // ...
        render = () => (
            ({ valueToAnimate, variant }) =>
                <Motion defaultStyle={{ x: 0 }}
                    style={{ x: spring(valueToAnimate || 0, presets.gentle) }}
                >
                    {value =>
                        <Typography variant={variant || "h6"}>
                            <NumberFormat
                                value={value.x}
                                displayType={"text"}
                                decimalScale={4}
                                isNumericString
                            />
                        </Typography>
                    }
                </Motion>
        )(this.props)

    }
)
