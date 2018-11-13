import React, { Component } from "react"
import { bindActionCreators, compose } from "redux"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import { withStyles } from "@material-ui/core/styles"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogContentText from "@material-ui/core/DialogContentText"
import DialogTitle from "@material-ui/core/DialogTitle"
import withMobileDialog from "@material-ui/core/withMobileDialog"
import { action as KeysActions} from "../../redux/Keys"
import Button from "../../lib/mui-v1/Button"



// <ModalSignupPure> component
export default compose(
    withMobileDialog(),
    withStyles((theme) => ({
        textBlue: {
            color: theme.palette.custom.blue,
        },
    })),
    connect(
        (state) => ({
            open: state.Keys.ModalSignupPure.showing,
        }),
        (dispatch) => bindActionCreators({
            hideModal: KeysActions.hideSignupPureModal,
        }, dispatch)
    )
)(
    class extends Component {

        // ...
        static propTypes = {
            classes: PropTypes.object.isRequired,
        }


        // ...
        handleYes = () => {
            this.props.hideModal()
        }


        // ...
        handleNo = () => {
            this.props.hideModal()
        }


        // ...
        render = () => (
            ({ classes, fullScreen, open }) =>
                <Dialog
                    fullScreen={fullScreen}
                    open={open}
                    aria-labelledby="responsive-dialog-title"
                >
                    <DialogTitle id="responsive-dialog-title">
                        Shambhala Pure - Welcome
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText classes={{ root: classes.textBlue }}>
                        In a moment we will generate a random super secret key.
                        DO NOT EVER share it with anyone. This key has the total
                        control over your funds and entire account. This is why
                        it will only be shown to you once here and never again.
                        Understandably, we will never have access to this key
                        and therefore cannot help you, should you loose access
                        to it. Make sure to store it safely!
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleYes} color="green"
                            autoFocus
                        >
                            Proceed
                        </Button>
                        <Button style={{margin: "0 3px 0 10px"}}
                            onClick={this.handleNo} color="yellow"
                        >
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
        )(this.props)

    }
)
