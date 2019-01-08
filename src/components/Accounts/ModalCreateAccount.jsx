import React from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import { withStyles } from "@material-ui/core/styles"
import {
    Dialog,
    DialogContent,
    DialogTitle,
    Typography,
    withMobileDialog
} from "@material-ui/core"
import TextInput from "../../lib/mui-v1/TextInput"
import { func, string } from "@xcmats/js-toolbox"
import { accountType as at } from "../../redux/Accounts"
import Awaiter from "../Awaiter"
import StepperCreateAccount from "./StepperCreateAccount"
import { setName } from "../../actions/createAccount"




// ...
const ModalCreateAccount = ({
    accountType, classes, error, errorMessage, fullScreen, open, setName,
    spinnerVisible,
}) => {

    return <Dialog
        fullScreen={fullScreen}
        open={open}
        aria-labelledby="responsive-dialog-title"
        classes={{
            paper: func.choose(
                accountType, {
                    [at.REAL]: () => classes.paperReal,
                    [at.DEMO]: () => classes.paperDemo,
                }, () => "unknown account type"),
        }}
    >
        <DialogTitle id="responsive-dialog-title">
            Create new {func.choose(
                accountType, {
                    [at.REAL]: () => at.REAL,
                    [at.DEMO]: () => at.DEMO,
                }, () => string.empty())} account.
        </DialogTitle>
        <DialogContent>
            {spinnerVisible ?
                <div className="flex-box-col items-centered content-centered">
                    <Awaiter />
                </div> :
                <div className="flex-box-col">
                    <Typography
                        style={{ marginBottom: "1rem" }}
                        variant="subtitle1"
                    >
                        Please select the name that will best identify your
                        new account. This name can be edited later at any time.
                    </Typography>
                    <TextInput
                        autoFocus
                        label="Account Name"
                        onChange={(e) => setName(e.target.value)}
                        error={error}
                        errorMessage={errorMessage}
                        errorClasses={classes.inputError}
                    />
                </div>
            }
        </DialogContent>
        <StepperCreateAccount />
    </Dialog>
}


// ...
export default func.compose(
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
        paperReal: {
            backgroundColor: theme.palette.custom.greenDark,
        },
        paperDemo: {
            backgroundColor: theme.palette.error.main,
        },
    })),
    connect(
        (state) => ({
            accountType: state.Accounts.accountType,
            error: state.Accounts.error,
            errorMessage: state.Accounts.errorMessage,
            open: state.Accounts.ModalCreateAccount.showing,
            spinnerVisible: state.Awaiter.spinnerVisible,
        }),
        (dispatch) => bindActionCreators({
            setName,
        }, dispatch),
    ),
)(ModalCreateAccount)
