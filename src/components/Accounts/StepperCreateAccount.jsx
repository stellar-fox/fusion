import React from "react"
import { makeStyles } from "@material-ui/styles"
import MobileStepper from "@material-ui/core/MobileStepper"
import Button from "@material-ui/core/Button"
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft"
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight"




// ...
const useStyles = makeStyles({
    root: {
        maxWidth: 400,
        flexGrow: 1,
    },
})



// ...
const StepperCreateAccount = () => {
    const classes = useStyles()

    const [activeStep, setActiveStep] = React.useState(0)

    const handleNext = () => {
        setActiveStep(prevActiveStep => prevActiveStep + 1)
    }

    const handleBack = () => {
        setActiveStep(prevActiveStep => prevActiveStep - 1)
    }

    return (
        <MobileStepper
            variant="progress"
            steps={6}
            position="static"
            activeStep={activeStep}
            className={classes.root}
            nextButton={
                <Button size="small" onClick={handleNext} disabled={activeStep === 5}>
                    Next
                    <KeyboardArrowRight />
                </Button>
            }
            backButton={
                <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                    <KeyboardArrowLeft />
                Back
                </Button>
            }
        />
    )
}




// ...
export default StepperCreateAccount
