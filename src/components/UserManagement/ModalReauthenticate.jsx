import React from "react"
import { connect } from "react-redux"
import {
    bindActionCreators,
    compose,
} from "redux"
import { string } from "@xcmats/js-toolbox"
import {
    DialogContent,
    DialogContentText,
    DialogTitle,
    Typography,
    withMobileDialog,
} from "@material-ui/core"
import ConfirmDialog from "../../lib/mui-v1/ConfirmDialog"
import TextInput from "../../lib/mui-v1/TextInput"
import { actions as ModalsActions, modalNames } from "../../redux/Modals"
import { deleteUserAccount } from "../../thunks/DeleteUserAccount"
import { reAuthenticate } from "../../thunks/main"
import ReCaptchaV2 from "../ReCaptchaV2"



const ModalDeleteAccount = ({
    dialogVisible, error, errorMessage, inProgress, toggleError, toggleModal,
    reAuthenticate, reCaptchaError, reCaptchaVisible,
}) => {

    const [state, setState] = React.useState({
        password: string.empty(),
        error: false,
        errorMessage: string.empty(),
    })


    const setPassword = (e) => {
        toggleError(string.empty())
        setState({
            ...state,
            password: e.target.value,
        })
    }

    const handleHideDialog = () => {
        toggleModal(modalNames.REAUTHENTICATE, false)
    }


    const handleReauthenticate = () => reAuthenticate(state.password)




    return <ConfirmDialog
        dialogVisible={dialogVisible}
        inProgress={inProgress}
        onOk={handleReauthenticate}
        onCancel={handleHideDialog}
        okButtonText="OK"
    >
        <DialogTitle id="responsive-dialog-title">
            {"Recent Authentication Required"}
        </DialogTitle>
        <DialogContent>
            <DialogContentText style={{ paddingBottom: "1em" }}>
                This operation is sensitive and requires your
                password confirmation.
            </DialogContentText>
            <TextInput
                id="password"
                label="Password"
                type="password"
                fullWidth
                lighter
                autocomplete={false}
                onChange={setPassword}
                error={error}
                errorMessage={errorMessage}
            />

            {reCaptchaVisible && <ReCaptchaV2 />}

            {reCaptchaError &&
                <Typography
                    style={{
                        height: 11,
                        marginTop: "0.5rem",
                        marginBottom: "1rem",
                        opacity: 0.5,
                    }}
                    variant="body2"
                >
                    {reCaptchaError}
                </Typography>
            }

        </DialogContent>
    </ConfirmDialog>
}




// <ModalDeleteAccount> component
export default compose(
    withMobileDialog(),
    connect(
        (state) => ({
            error: state.Modals.error,
            errorMessage: state.Modals.errorMessage,
            dialogVisible: state.Modals[modalNames.REAUTHENTICATE],
            inProgress: state.Modals.inProgress,
            reCaptchaError: state.Auth.reCaptchaError,
            reCaptchaVisible: state.Auth.reCaptchaVisible,
        }),
        (dispatch) => bindActionCreators({
            deleteUserAccount,
            toggleError: ModalsActions.toggleError,
            toggleModal: ModalsActions.toggleModal,
            reAuthenticate,
        }, dispatch),
    )
)(ModalDeleteAccount)
