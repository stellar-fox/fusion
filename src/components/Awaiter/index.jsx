import React, { Component, Fragment } from "react"
import { bindActionCreators, compose } from "redux"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import { withStyles } from "@material-ui/core/styles"
import {
    CircularProgress,
    Typography,
    withMobileDialog
} from "@material-ui/core"
import {
    Motion,
    presets,
    spring,
} from "react-motion"
import {
    CheckCircleOutlineRounded,
    ErrorOutlineRounded,
} from "@material-ui/icons"




// <Awaiter> component
export default compose(
    withMobileDialog(),
    withStyles((theme) => ({
        circle: {
            color: theme.palette.custom.purpleLight,
        },
        circularProgress: {
            opacity: "0.95",
        },
        colorError: {
            color: theme.palette.custom.orangeLight,
            opacity: "0.95",
        },
        colorTextPrimary: {
            color: theme.palette.custom.antiFlashWhite,
        },
        checkIcon: {
            fontSize: "5rem",
            color: theme.palette.custom.greenLight,
            opacity: "0.5",
        },
        errorIcon: {
            fontSize: "5rem",
            color: theme.palette.error.light,
            opacity: "0.5",
        },
    })),
    connect(
        (state) => ({
            errorMessage: state.Awaiter.errorMessage,
            progressMessage: state.Awaiter.progressMessage,
            spinnerVisible: state.Awaiter.spinnerVisible,
            success: state.Awaiter.success,
        }),
        (dispatch) => bindActionCreators({}, dispatch)
    )
)(
    class extends Component {

        // ...
        static propTypes = {
            classes: PropTypes.object.isRequired,
        }


        // ...
        render = () => (
            ({ classes, errorMessage, progressMessage, spinnerVisible,
                success }) =>
                <div className="flex-box-col items-centered content-centered">
                    {progressMessage &&
                    <Fragment>
                        {spinnerVisible &&
                        <Motion defaultStyle={{ opacity: 0 }}
                            style={{ opacity: spring(
                                spinnerVisible ? 1 : 0, presets.gentle
                            ) }}
                        >
                            {value =>
                                <div style={{
                                    opacity: value.opacity,
                                }}
                                >
                                    <CircularProgress disableShrink
                                        size={60}
                                        thickness={0.7}
                                        classes={{
                                            circle: classes.circle,
                                            root: classes.circularProgress,
                                        }}
                                    />
                                </div>
                            }
                        </Motion>
                        }
                        {success &&
                        <Motion defaultStyle={{ opacity: 0 }}
                            style={{ opacity: spring(
                                success ? 1 : 0, presets.gentle
                            ) }}
                        >
                            {value =>
                                <div style={{
                                    opacity: value.opacity,
                                }}
                                >
                                    <CheckCircleOutlineRounded classes={{
                                        root: classes.checkIcon,
                                    }}
                                    />
                                </div>
                            }
                        </Motion>
                        }
                        <Motion defaultStyle={{ opacity: 0 }}
                            style={{ opacity: spring(
                                progressMessage ? 1 : 0, presets.gentle
                            ) }}
                        >
                            {value =>
                                <div style={{
                                    opacity: value.opacity,
                                }} className="m-t flex-box-row items-centered"
                                >
                                    <Typography
                                        classes={{
                                            colorTextPrimary: classes.colorTextPrimary,
                                        }} color="textPrimary" variant="body2"
                                    >
                                        {progressMessage}
                                    </Typography>
                                </div>
                            }
                        </Motion>
                    </Fragment>
                    }

                    {errorMessage &&
                    <Fragment>
                        <Motion defaultStyle={{ opacity: 0 }}
                            style={{ opacity: spring(
                                this.props.errorMessage ? 1 : 0,
                                presets.gentle
                            ) }}
                        >
                            {value =>
                                <div style={{
                                    opacity: value.opacity,
                                }} className="flex-box-row items-centered"
                                >

                                    <ErrorOutlineRounded classes={{
                                        root: classes.errorIcon,
                                    }}
                                    />

                                </div>
                            }
                        </Motion>
                        <Motion defaultStyle={{ opacity: 0 }}
                            style={{ opacity: spring(
                                errorMessage ? 1 : 0,
                                presets.gentle
                            ) }}
                        >
                            {value =>
                                <div style={{
                                    opacity: value.opacity,
                                }} className="flex-box-row items-centered"
                                >
                                    <Typography color="error"
                                        classes={{ colorError: classes.colorError }}
                                        variant="body2"
                                    >
                                        {errorMessage}
                                    </Typography>
                                </div>
                            }
                        </Motion>
                    </Fragment>
                    }
                </div>
        )(this.props)

    }
)
