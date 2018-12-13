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
    FormControl,
    InputLabel,
    Select,
    withMobileDialog
} from "@material-ui/core"
import Button from "../../lib/mui-v1/Button"
import TextInput from "../../lib/mui-v1/TextInput"
import {
    cancel,
    setAmount,
    setDestination,
    setMemo,
    setSigningMethod,
} from "../../actions/payment"
import Awaiter from "../Awaiter"
import { func, shorten } from "@xcmats/js-toolbox"
import { accountType as at } from "../../redux/Accounts"




// <ModalPay> component
export default compose(
    withMobileDialog(),
    withStyles((theme) => ({
        paperReal: {
            backgroundColor: theme.palette.custom.greenDark,
        },
        paperDemo: {
            backgroundColor: theme.palette.error.main,
        },
    })),
    connect(
        (state) => ({
            availableSigningMethods: state.Pay.availableSigningMethods,
            open: state.Pay.ModalPay.showing,
            source: state.Pay.source,
            yesButtonDisabled: state.Pay.yesButtonDisabled,
            stellarAccounts: state.StellarAccounts,
        }),
        (dispatch) => bindActionCreators({
            cancel,
            setAmount,
            setDestination,
            setMemo,
            setSigningMethod,
        }, dispatch)
    )
)(
    class extends Component {

        // ...
        static propTypes = {
            classes: PropTypes.object.isRequired,
        }

        // ...
        handleAmountChange = () => (event) =>
            this.props.setAmount(event.target.value)


        // ...
        handleDestinationChange = () => (event) =>
            this.props.setDestination(event.target.value)


        // ...
        handleMemoChange = () => (event) =>
            this.props.setMemo(event.target.value)


        // ...
        handleSigningMethodChange = () => (event) =>
            this.props.setSigningMethod(event.target.value)


        // ...
        handleNo = () => this.props.cancel()


        // ...
        render = () => (
            ({
                accountType, availableSigningMethods, classes, error,
                errorMessage, source, fullScreen, open, yesButtonDisabled,
            }) =>
                <Dialog
                    fullScreen={fullScreen}
                    open={open}
                    aria-labelledby="responsive-dialog-title"
                    classes={{ paper: func.choose(accountType, {
                        [at.REAL]: () => classes.paperReal,
                        [at.DEMO]: () => classes.paperDemo,
                    }, () => "unknown account type") }}
                >
                    <DialogTitle id="responsive-dialog-title">
                        Pay using {source && shorten(source, 11, shorten.MIDDLE, "-")}
                    </DialogTitle>
                    <DialogContent>
                        <div className="flex-box-col items-centered content-centered">
                            <Awaiter />
                        </div>
                        <div className="flex-box-col">
                            <TextInput
                                label="Destination"
                                onChange={this.handleDestinationChange()}
                                error={error}
                                errorMessage={errorMessage}
                                errorClasses={ classes.inputError }
                            />
                            <TextInput
                                label="Amount"
                                onChange={this.handleAmountChange()}
                                error={error}
                                errorMessage={errorMessage}
                                errorClasses={ classes.inputError }
                            />
                            <TextInput
                                label="Memo"
                                onChange={this.handleMemoChange()}
                                error={error}
                                errorMessage={errorMessage}
                                errorClasses={ classes.inputError }
                            />
                            <FormControl className={classes.formControl}>
                                <InputLabel shrink htmlFor="sm">Signature Provider</InputLabel>
                                <Select
                                    native
                                    defaultValue=""
                                    onChange={this.handleSigningMethodChange("sm")}
                                    inputProps={{
                                        name: "sm",
                                        id: "sm",
                                    }}
                                >
                                    <option disabled value="">Please Select</option>
                                    {availableSigningMethods.map((signingMethod) =>
                                        <option value="signingMethod">{signingMethod}</option>
                                    )}
                                </Select>
                            </FormControl>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={this.handleYes} color="green"
                            disabled={yesButtonDisabled ? yesButtonDisabled : true}
                        >
                            Submit
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
