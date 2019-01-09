import React from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import { withStyles } from "@material-ui/core/styles"
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@material-ui/core"
import { func, string } from "@xcmats/js-toolbox"
import { accountType as at } from "../../redux/Accounts"
import Awaiter from "../Awaiter"
import StepperCreateAccount from "./StepperCreateAccount"
import Step0 from "./Step0"
import Step1 from "./Step1"




/**
 * Fusion.
 *
 * Full screen modal for account creation content.
 *
 * @module client-ui-components
 * @license Apache-2.0
 */




/**
 * `<ModalCreateAccount>` component.
 *
 * @function ModalCreateAccount
 * @returns {React.ReactElement}
 */
const ModalCreateAccount = ({
    accountType, activeStep, classes, open, spinnerVisible,
}) => {

    return <Dialog
        fullScreen
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
            You are creating a {func.choose(
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
                func.choose(
                    activeStep, {
                        0: () => <Step0 />,
                        1: () => <Step1 />,
                    }, () => string.empty())
            }
        </DialogContent>
        <StepperCreateAccount />
    </Dialog>
}




// ...
export default func.compose(
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
            activeStep: state.Accounts.activeStep,
            open: state.Accounts.ModalCreateAccount.showing,
            spinnerVisible: state.Awaiter.spinnerVisible,
        }),
        (dispatch) => bindActionCreators({

        }, dispatch),
    ),
)(ModalCreateAccount)
