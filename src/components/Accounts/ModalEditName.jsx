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
    accountType as at,
} from "../../redux/Accounts"
import { func, shorten } from "@xcmats/js-toolbox"
import {
    handleYes,
    handleNo,
} from "../../actions/setAccountName"
import { getAccountType } from "../../lib/logic/stellarAccount"




// <ModalEditName> component
export default compose(
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
            accountId: state.Accounts.accountId,
            open: state.Accounts.ModalEditName.showing,
            stellarAccounts: state.StellarAccounts,
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
                handleNo, handleYes, stellarAccounts,
            }) =>
                <Dialog
                    fullScreen={fullScreen}
                    open={open}
                    aria-labelledby="responsive-dialog-title"
                    classes={{
                        paper: accountId && func.choose(getAccountType(stellarAccounts, accountId), {
                            [at.REAL]: () => classes.paperReal,
                            [at.DEMO]: () => classes.paperDemo,
                        }, () => "unknown account type"),
                    }}
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
                                autoFocus
                                defaultValue={accountId && stellarAccounts[accountId].name}
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
