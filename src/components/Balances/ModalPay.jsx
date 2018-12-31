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
    MenuItem,
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
        selectMenuReal: {
            color: theme.palette.custom.antiFlashWhite,
            "&:focus": {
                backgroundColor: theme.palette.custom.greenDark,
            },
        },
        selectMenuDemo: {
            color: theme.palette.custom.antiFlashWhite,
            "&:focus": {
                backgroundColor: theme.palette.error.main,
            },
        },
        inputReal: {
            color: theme.palette.primary.main,
            borderBottom: `1px solid ${theme.palette.custom.onyx}`,
        },
        inputDemo: {
            color: theme.palette.primary.main,
            borderBottom: `1px solid ${theme.palette.custom.onyx}`,
        },
        selectIconReal: {
            color: theme.palette.custom.antiFlashWhite,
        },
        selectIconDemo: {
            color: theme.palette.custom.onyx,
        },
    })),
    connect(
        (state) => ({
            accountType: state.Pay.accountType,
            availableSigningMethods: state.Pay.availableSigningMethods,
            open: state.Pay.ModalPay.showing,
            signingMethod: state.Pay.signingMethod,
            source: state.Pay.source,            
            stellarAccounts: state.StellarAccounts,
            yesButtonDisabled: state.Pay.yesButtonDisabled,
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
                signingMethod,
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
                                    classes={{
                                        selectMenu: func.choose(accountType, {
                                            [at.REAL]: () => classes.selectMenuReal,
                                            [at.DEMO]: () => classes.selectMenuDemo,
                                        }, () => "unknown account type"),
                                        root: func.choose(accountType, {
                                            [at.REAL]: () => classes.inputReal,
                                            [at.DEMO]: () => classes.inputDemo,
                                        }, () => "unknown account type"),
                                        icon: func.choose(accountType, {
                                            [at.REAL]: () => classes.selectIconReal,
                                            [at.DEMO]: () => classes.selectIconDemo,
                                        }, () => "unknown account type"),
                                    }}
                                    displayEmpty
                                    disableUnderline
                                    value={signingMethod}
                                    onChange={this.handleSigningMethodChange("sm")}
                                    inputProps={{
                                        name: "sm",
                                        id: "sm",
                                    }}
                                >
                                    <MenuItem disabled value="">
                                        <em>Please Select</em>
                                    </MenuItem>
                                    {availableSigningMethods.map((signingMethod) =>
                                        <MenuItem key={signingMethod} value={signingMethod}>{signingMethod}</MenuItem>
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
