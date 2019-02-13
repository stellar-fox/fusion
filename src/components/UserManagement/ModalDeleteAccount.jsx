import React from "react"
import { connect } from "react-redux"
import {
    bindActionCreators,
    compose,
} from "redux"
import {
    DialogContent,
    DialogContentText,
    DialogTitle,
    withMobileDialog,
} from "@material-ui/core"
import ConfirmDialog from "../../lib/mui-v1/ConfirmDialog"
import { actions as ModalsActions, modalNames } from "../../redux/Modals"
import { deleteUserAccount } from "../../thunks/DeleteUserAccount"




// ...
const ModalDeleteAccount = ({
    dialogVisible, deleteUserAccount, inProgress, toggleModal,
}) => {
    
    const handleDeleteAccount = () => deleteUserAccount()

    const handleHideDialog = () => {
        toggleModal(modalNames.CONFIRM_DELETE_ACCOUNT, false)
    }

    return <ConfirmDialog
        dialogVisible={dialogVisible}
        onOk={handleDeleteAccount}
        onCancel={handleHideDialog}
        okButtonText="OK"
        inProgress={inProgress}
    >
        <DialogTitle id="responsive-dialog-title">
            {"DELETING ACCOUNT"}
        </DialogTitle>
        <DialogContent>
            <DialogContentText style={{ paddingBottom: "1em" }}>
                You are about to delete your account. This action
                cannot be undone and deletes your personal and
                custom information from our servers.
                Your funds are safe and under your control as long
                as you are in sole posession of your 24-word passphrase.
            </DialogContentText>
        </DialogContent>
    </ConfirmDialog>
}




// <ModalDeleteAccount> component
export default compose(
    withMobileDialog(),
    connect(
        (state) => ({
            dialogVisible: state.Modals[modalNames.CONFIRM_DELETE_ACCOUNT],
            inProgress: state.Modals.inProgress,
        }),
        (dispatch) => bindActionCreators({
            deleteUserAccount,
            toggleModal: ModalsActions.toggleModal,
        }, dispatch),
    )
)(ModalDeleteAccount)
