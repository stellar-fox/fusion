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
    withMobileDialog
} from "@material-ui/core"
import Button from "../../lib/mui-v1/Button"
import TextInput from "../../lib/mui-v1/TextInput"
import Awaiter from "../Awaiter"
import {
    action as AccountsActions,
} from "../../redux/Accounts"




// <ModalEditName> component
export default compose(
    withMobileDialog(),
    withStyles((theme) => ({
        input: {
            color: theme.palette.primary.silverChalice,
            borderBottom: `1px solid ${theme.palette.custom.onyx}`,
        },
    })),
    connect(
        (state) => ({
            name: state.Accounts.name,
            open: state.Accounts.ModalEditName.showing,
        }),
        (dispatch) => bindActionCreators({
            resetState: AccountsActions.resetState,
            setName: AccountsActions.setName,
            updateName: AccountsActions.updateName,
        }, dispatch)
    )
)(
    class extends Component {

        // ...
        static propTypes = {
            classes: PropTypes.object.isRequired,
        }


        // ...
        handleNameChange = () => (event) =>
            this.props.setName(event.target.value)


        // ...
        handleNo = () => {
            this.props.resetState()
        }


        // ...
        handleYes = () => {
            this.props.updateName(this.props.name)
            this.props.resetState()
        }


        // ...
        render = () => (
            ({
                classes, error, errorMessage, fullScreen, open,
            }) =>
                <Dialog
                    fullScreen={fullScreen}
                    open={open}
                    aria-labelledby="responsive-dialog-title"
                    classes={{ paper: classes.paper }}
                >
                    <DialogTitle id="responsive-dialog-title">
                        Update Account Name
                    </DialogTitle>
                    <DialogContent>
                        <div className="flex-box-col items-centered content-centered">
                            <Awaiter />
                        </div>
                        <div className="flex-box-col">
                            <TextInput
                                classes={{ root: classes.input }}
                                label="Account Name"
                                onChange={this.handleNameChange()}
                                error={error}
                                errorMessage={errorMessage}
                                errorClasses={classes.inputError}
                            />
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={this.handleYes} color="green"
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
