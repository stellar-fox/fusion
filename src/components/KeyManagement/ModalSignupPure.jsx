import React, { Component } from "react"
import { bindActionCreators, compose } from "redux"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import { withStyles } from "@material-ui/core/styles"
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
    withMobileDialog
} from "@material-ui/core"
import {
    resetOnboardingState,
} from "../../actions/onboarding"
import { signup } from "../../actions/recipes/signup"
import Button from "../../lib/mui-v1/Button"
import { signingMethod as sm } from "../../redux/Keys"



// <ModalSignupPure> component
export default compose(
    withMobileDialog(),
    withStyles((theme) => ({
        paper: {
            backgroundColor: theme.palette.custom.blueDark,
        },
    })),
    connect(
        (state) => ({
            open: state.Keys.ModalSignupPure.showing,
        }),
        (dispatch) => bindActionCreators({
            resetOnboardingState,
            signup,
        }, dispatch)
    )
)(
    class extends Component {

        // ...
        static propTypes = {
            classes: PropTypes.object.isRequired,
        }


        // ...
        handleYes = () => this.props.signup(sm.SHAMBHALA)


        // ...
        handleNo = () => this.props.resetOnboardingState()


        // ...
        render = () => (
            ({ classes, fullScreen, open }) =>
                <Dialog
                    fullScreen={fullScreen}
                    open={open}
                    aria-labelledby="responsive-dialog-title"
                    classes={{ paper: classes.paper }}
                >
                    <DialogTitle id="responsive-dialog-title">
                        Shambhala Pure - Welcome!
                    </DialogTitle>
                    <DialogContent>
                        <Typography variant="subtitle1">
                            You will associate this device with your bank.
                            It will provide a convenice to manage your funds
                            and sign transactions with a PIN. Suitable
                            for novice users.
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleYes} color="green"
                            autoFocus
                        >
                            Proceed
                        </Button>
                        <Button style={{margin: "0 3px 0 10px"}}
                            onClick={this.handleNo} color="yellow"
                        >
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
        )(this.props)

    }
)
