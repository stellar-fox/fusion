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
    FormControlLabel,
    Switch,
    Typography,
    withMobileDialog,
} from "@material-ui/core"
import Button from "../../lib/mui-v1/Button"
import TextInput from "../../lib/mui-v1/TextInput"
import { cancel } from "../../actions/onboarding"
import { signup } from "../../actions/recipes/signup"
import {
    setAccount,
    setUseDefaultAccount,
} from "../../actions/ledgering"
import { type } from "@xcmats/js-toolbox"
import {
    Motion,
    presets,
    spring,
} from "react-motion"
import { signingMethod as sm } from "../../redux/Keys"




// <ModalSignupPure> component
export default compose(
    withMobileDialog(),
    withStyles((theme) => ({
        inputError: {
            "&:hover:before": {
                borderBottomColor: `${theme.palette.error.light} !important`,
                borderBottomWidth: "1px !important",
            },
            "&:before": {
                borderBottomColor:
                    `${theme.palette.error.light} !important`,
            },
            "&:after": {
                borderBottomColor:
                    `${theme.palette.error.light} !important`,
            },
        },
        paper: {
            backgroundColor: theme.palette.custom.greenDark,
        },
    })),
    connect(
        (state) => ({
            open: state.Keys.ModalSignupLedger.showing,
            account: state.LedgerHQ.account,
            useDefaultAccount: state.LedgerHQ.useDefaultAccount,
            error: state.LedgerHQ.error,
            errorMessage: state.LedgerHQ.errorMessage,
        }),
        (dispatch) => bindActionCreators({
            cancel,
            signup,
            setAccount,
            setUseDefaultAccount,
        }, dispatch)
    )
)(
    class extends Component {

        // ...
        static propTypes = {
            classes: PropTypes.object.isRequired,
        }


        // ...
        handleYes = () => this.props.signup(sm.LEDGERHQ)


        // ...
        handleNo = () => this.props.cancel()


        // ...
        handleSwitch = () => (event) =>
            this.props.setUseDefaultAccount(event.target.checked)


        // ...
        handleChange = () => (event) =>
            this.props.setAccount(event.target.value)


        // ...
        render = () => (
            ({
                classes, error, errorMessage, fullScreen, open,
                useDefaultAccount,
            }) =>
                <Dialog
                    fullScreen={fullScreen}
                    open={open}
                    aria-labelledby="responsive-dialog-title"
                    classes={{ paper: classes.paper }}
                >
                    <DialogTitle id="responsive-dialog-title">
                        Shambhala Ledger - Welcome!
                    </DialogTitle>
                    <DialogContent>
                        <Typography variant="subtitle1">
                            Associate your <span className="cursive">
                            Ledger Nano S</span> device with your bank.
                            Gives you convenience of signing transactions
                            with a PIN with no physical device present.
                        </Typography>
                        <div className="m-t flex-box-row">
                            <FormControlLabel control={
                                <Switch
                                    checked={type.toBool(useDefaultAccount)}
                                    onChange={this.handleSwitch()}
                                />
                            } label="Use Default Account"
                            />
                        </div>

                        {!useDefaultAccount &&
                        <Motion defaultStyle={{ opacity: 0 }}
                            style={{
                                opacity: spring(
                                    useDefaultAccount ? 0 : 1,
                                    presets.gentle
                                ),
                            }}
                        >
                            {value =>
                                <div style={{ opacity: value.opacity }}
                                    className="flex-box-row"
                                >
                                    <TextInput
                                        label="Account"
                                        defaultValue={this.props.account}
                                        onChange={this.handleChange()}
                                        type="number"
                                        min="0"
                                        error={error}
                                        errorMessage={errorMessage}
                                        errorClasses={ classes.inputError }
                                    />
                                </div>}
                        </Motion>
                        }

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleYes} color="green"
                            autoFocus
                        >
                            Proceed
                        </Button>
                        <Button style={{ margin: "0 3px 0 10px" }}
                            onClick={this.handleNo} color="yellow"
                        >
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
        )(this.props)

    }
)
