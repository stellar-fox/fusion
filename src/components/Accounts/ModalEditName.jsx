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
import { shorten } from "@xcmats/js-toolbox"
import {
    handleYes,
    handleNo,
} from "../../actions/setAccountName"




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
            accountId: state.Accounts.accountId,
            name: state.Accounts.name,
            open: state.Accounts.ModalEditName.showing,
        }),
        (dispatch) => bindActionCreators({
            handleNo,
            handleYes,
            resetState: AccountsActions.resetState,
            setName: AccountsActions.setName,
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
        render = () => (
            ({
                accountId, classes, error, errorMessage, fullScreen, open,
                handleNo, handleYes,
            }) =>
                <Dialog
                    fullScreen={fullScreen}
                    open={open}
                    aria-labelledby="responsive-dialog-title"
                    classes={{ paper: classes.paper }}
                >
                    <DialogTitle id="responsive-dialog-title">
                        Set account name for {shorten(accountId, 11, shorten.MIDDLE, "-")}
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
                            onClick={handleYes} color="green"
                        >
                            Submit
                        </Button>
                        <Button style={{ margin: "0 3px 0 10px" }}
                            onClick={handleNo} color="yellow"
                        >
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
        )(this.props)

    }
)
