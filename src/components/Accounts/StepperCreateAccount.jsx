import React from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import { withStyles } from "@material-ui/core/styles"
import { func } from "@xcmats/js-toolbox"
import {
    MobileStepper,
    withMobileDialog
} from "@material-ui/core"
import withWidth, { isWidthDown } from "@material-ui/core/withWidth"
import Button from "../../lib/mui-v1/Button"
import {
    handleYes,
} from "../../actions/createAccount"
import { accountType as at } from "../../redux/Accounts"
import {
    cancel,
    next,
} from "../../thunks/AddAccount/"




/**
 * Fusion.
 *
 * Stepper for creating new account.
 *
 * @module client-ui-components
 * @license Apache-2.0
 */




/**
 * `<StepperCreateAccount>` component.
 *
 * @function StepperCreateAccount
 * @returns {React.ReactElement}
 */
const StepperCreateAccount = ({
    accountType, activeStep, classes, cancel, handleYes, next,
    width,
}) => {

    const numSteps = 2

    return <MobileStepper
        LinearProgressProps={{
            classes: {
                root: classes.progress,
                bar: classes.bar,
            },
        }}
        classes={{
            dotActive: classes.dotActive,
            root: func.choose(
                accountType, {
                    [at.REAL]: () => classes.paperReal,
                    [at.DEMO]: () => classes.paperDemo,
                }, () => "unknown account type"),
        }}
        variant="dots"
        position={isWidthDown("md", width) ? "bottom" : "static"}
        steps={numSteps+1}
        activeStep={activeStep}
        className={classes.rootCommon}
        nextButton={
            <Button color="green"
                style={{
                    marginLeft: "0.5rem",
                }}
                size="small"
                onClick={activeStep < numSteps ? next : handleYes}
            >{activeStep === numSteps ? "Finish" : "Next"}
            </Button>
        }
        backButton={
            <Button color="yellow"
                style={{
                    marginRight: "0.5rem",
                }}
                size="small"
                onClick={cancel}
            >
            Cancel
            </Button>
        }
    />
    
}




// ...
export default func.compose(
    withMobileDialog(),
    withWidth(),
    withStyles((theme) => ({
        dotActive: {
            backgroundColor: theme.palette.custom.yellowLight,
        },
        paperReal: {
            backgroundColor: theme.palette.custom.greenDark,
        },
        paperDemo: {
            backgroundColor: theme.palette.error.main,
        },
        rootCommon: {
            flexGrow: 1,
        },
        progress: {
            backgroundColor: theme.palette.custom.green,
        },
        bar: {
            backgroundColor: theme.palette.custom.yellowLight,
        },
        backButton: {
            marginRight: "0.5rem",
        },
        nextButton: {
            marginLeft: "0.5rem",
        },
    })),
    connect(
        (state) => ({
            accountType: state.AddAccount.accountType,
            activeStep: state.AddAccount.activeStep,
        }),
        (dispatch) => bindActionCreators({
            cancel,
            handleYes,
            next,
        }, dispatch),
    ),
)(StepperCreateAccount)
