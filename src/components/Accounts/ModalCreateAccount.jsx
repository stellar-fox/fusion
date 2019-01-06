import React from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import { withStyles } from "@material-ui/core/styles"
import {
    Dialog,
    DialogContent,
    DialogTitle,
    withMobileDialog
} from "@material-ui/core"
import TextInput from "../../lib/mui-v1/TextInput"
import { func, string } from "@xcmats/js-toolbox"
import { accountType as at } from "../../redux/Accounts"
import Awaiter from "../Awaiter"
import { action as AccountsActions } from "../../redux/Accounts"
import StepperCreateAccount from "./StepperCreateAccount"




// ...
const ModalCreateAccount = ({
    accountType, classes, error, errorMessage, fullScreen,
    open, setName, spinnerVisible,
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
            open: state.Accounts.ModalCreateAccount.showing,
            spinnerVisible: state.Awaiter.spinnerVisible,
        }),
        (dispatch) => bindActionCreators({
            setName: AccountsActions.setName,
        }, dispatch),
    ),
)(ModalCreateAccount)
