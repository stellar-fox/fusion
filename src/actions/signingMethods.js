/**
 * Fusion.
 *
 * _Signing Methods_ actions. Functions in this module pertain to
 * _Signing Methods_ entity. They can query or mutate the redux state.
 * Should be used to set the _Redux_ state and called from within UI components.
 *
 * @module actions-signingMethods
 * @license Apache-2.0
 */




import { firebaseSingleton } from "../firebase"
import { action as SigningMethodsActions } from "../redux/SigningMethods"




/**
 * Listens for `signingMethods` changes in real-time database.
 * 
 * @function detectSigningMethod
 * @param {String} uid _Firebase_ generated unique user id.
 * @returns {Function}
 */
export const detectSigningMethod = (uid) =>
    async (dispatch, _getState) => {
        firebaseSingleton.database().ref(`user/${uid}/signingMethods`)
            .on("value", (snapshot) => {
                dispatch(SigningMethodsActions.setState({
                    ...snapshot.val(),
                }))
            })
    }
