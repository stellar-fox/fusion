import React from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import { withStyles } from "@material-ui/core/styles"
import { func } from "@xcmats/js-toolbox"
import {
    Typography,
    withMobileDialog
} from "@material-ui/core"



// ...
const StepperCreateAccount = () => {

    return (
        <div className="flex-box-col">
            <Typography
                style={{ marginBottom: "1rem" }}
                variant="subtitle1"
            >
                Next Step
            </Typography>
        </div>
    )
}




// ...
export default func.compose(
    withMobileDialog(),
    withStyles((_theme) => ({

    })),
    connect(
        (_state) => ({
            
        }),
        (dispatch) => bindActionCreators({

        }, dispatch),
    ),
)(StepperCreateAccount)
