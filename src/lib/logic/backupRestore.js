/**
 * Fusion.
 *
 * Backup/Restore _Shambhala_ web-storage structure to _Firebase Storage_.
 *
 * @module backup-restore
 * @license Apache-2.0
 */



import { Shambhala } from "../shambhala.client"
import { storageRef } from "../../firebase"
import { config } from "../../firebase/config"
import { action as AppActions } from "../../redux/Fusion"
import axios from "axios"
import { string } from "@xcmats/js-toolbox"




/**
 * Stores _Shambhala_ web-storage structure as encrypted base64 string in
 * _Firebase Storage_.
 *
 * @function backupToStorage
 * @param {String} accountId
 * @returns {Function}
 */
export const backupToStorage = (accountId) =>
    async (dispatch, getState) => {
        try {
            dispatch(AppActions.setState({
                backupError: string.empty(),
                backupInProgress: true,
            }))
            let
                backupRef = storageRef().child(
                    `${getState().Auth.uid}/${accountId}.backup`
                ),

                backupData = await new Shambhala(
                    config.shambhala.client, { token: getState().Keys.jwt }
                ).backup(accountId),

                uploadTask = backupRef.putString(backupData)

            uploadTask.on("state_changed", async (snapshot) => {
                if ((
                    snapshot.bytesTransferred / snapshot.totalBytes
                ) * 100 === 100) {
                    dispatch(AppActions.setState({
                        backupInProgress: false,
                    }))
                }
            })
        } catch (error) {
            dispatch(AppActions.setState({
                backupInProgress: false,
                backupError: error.message,
            }))
        }
    }




/**
 * Restores _Shambhala_ web-storage structure from encrypted base64 string in
 * _Firebase Storage_.
 *
 * @function restoreFromStorage
 * @param {String} accountId
 * @returns {Function}
 */
export const restoreFromStorage = (accountId) =>
    async (dispatch, getState) => {
        try {
            dispatch(AppActions.setState({
                restoreError: string.empty(),
                restoreInProgress: true,
            }))
            let
                backupRef = storageRef().child(
                    `${getState().Auth.uid}/${accountId}.backup`
                )

            backupRef.getDownloadURL().then(
                async (backupUrl) => {
                    let
                        response = await axios.get(backupUrl),

                        restoredBackup = await new Shambhala(
                            config.shambhala.client,
                            { token: getState().Keys.jwt }
                        ).restore(accountId, response.data)

                    dispatch(AppActions.setState({
                        restoredBackup,
                        restoreInProgress: false,
                    }))
                }
            )

        } catch (error) {
            dispatch(AppActions.setState({
                restoreInProgress: false,
                restoreError: error.message,
            }))
        }
    }
