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
    KeyboardArrowRight,
} from "@material-ui/icons"
import {
    handleYes,
    handleNo,
    incrementActiveStep,
} from "../../actions/createAccount"




// ...
const StepperCreateAccount = ({
    activeStep, classes, handleNo, handleYes, incrementActiveStep,
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
            }}
            variant="dots"
            steps={6}
            activeStep={activeStep}
            className={classes.root}
            nextButton={
                <Button color="green"
                    style={{
                        marginLeft: "0.5rem",
                        paddingRight: activeStep < 5 && "0.2rem",
                    }}
                    size="small"
                    onClick={activeStep < 5 ? handleNext : handleYes}
                    disabled={activeStep === 6}
                >{activeStep === 5 ? "Finish" : "Next"}
                    {activeStep < 5 && <KeyboardArrowRight />}
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
        root: {
            flexGrow: 1,
            backgroundColor: theme.palette.custom.greenDark,
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
            activeStep: state.Accounts.activeStep,
        }),
        (dispatch) => bindActionCreators({
            handleNo,
            handleYes,
            incrementActiveStep,
        }, dispatch),
    ),
)(StepperCreateAccount)
