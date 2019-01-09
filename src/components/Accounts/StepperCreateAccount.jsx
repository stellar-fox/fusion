import React from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import { withStyles } from "@material-ui/core/styles"
import { func } from "@xcmats/js-toolbox"
import {
    MobileStepper,
    withMobileDialog
} from "@material-ui/core"
import Button from "../../lib/mui-v1/Button"
import {
    handleYes,
    handleNo,
    incrementActiveStep,
} from "../../actions/createAccount"
import { accountType as at } from "../../redux/Accounts"




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
    accountType, activeStep, classes, handleNo, handleYes, incrementActiveStep,
}) => {

    const handleNext = () => incrementActiveStep()

    return (
        <MobileStepper
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
            steps={6}
            activeStep={activeStep}
            className={classes.rootCommon}
            nextButton={
                <Button color="green"
                    style={{
                        marginLeft: "0.5rem",
                    }}
                    size="small"
                    onClick={activeStep < 5 ? handleNext : handleYes}
                    disabled={activeStep === 6}
                >{activeStep === 5 ? "Finish" : "Next"}
                </Button>
            }
            backButton={
                <Button color="yellow"
                    style={{
                        marginRight: "0.5rem",
                    }}
                    size="small"
                    onClick={handleNo}
                    disabled={activeStep === 5}
                >
                Cancel
                </Button>
            }
        />
    )
}




// ...
export default func.compose(
    withMobileDialog(),
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
            accountType: state.Accounts.accountType,
            activeStep: state.Accounts.activeStep,
        }),
        (dispatch) => bindActionCreators({
            handleNo,
            handleYes,
            incrementActiveStep,
        }, dispatch),
    ),
)(StepperCreateAccount)
