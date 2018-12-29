/**
 * Fusion::Firebase
 *
 * Helper functions that leverage _Firebase_ API for user management, database
 * and storage functionality.
 *
 * @module fusion-firebase
 * @license Apache-2.0
 */


import { config } from "./config"
import { emailVerificationUrl } from "../lib/constants"
import firebase from "firebase/app"
import "firebase/auth"
import "firebase/database"
import "firebase/storage"




// initialize Firebase app
if (!firebase.apps.length) {
    firebase.initializeApp(config.firebase)
}




/**
 * _Firebase_ instance.
 * @constant {Object} firebaseSingleton _Firebase_ singleton instance.
 */
export const firebaseSingleton = firebase




/**
 * Authenticate with _Firebase_ using email/password credentials.
 *
 * @function authenticate
 * @param {String} email
 * @param {String} password
 * @returns {Promise} Contains `UserCredential` when resolved.
 */
export const authenticate = (email, password) =>
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
        .then((_) => firebase.auth()
            .signInWithEmailAndPassword(email, password)
        )
        .catch((error) => {
            return Promise.reject(error)
        })




/**
 * Signout with _Firebase_
 * @function signout
 * @returns {Promise} Contains `void` when resolved.
 */
export const signout = () => firebase.auth().signOut()





/**
 * Signup new user with _Firebase_
 *
 * @function signup
 * @param {String} email
 * @param {String} password
 * @returns {Promise} Contains `UserCredential` when resolved.
 */
export const signup = (email, password) =>
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
        .then((_) => firebase.auth()
            .createUserWithEmailAndPassword(email, password)
        )
        .catch((error) => {
            return Promise.reject(error)
        })




/**
 * Send verification email.
 *
 * @function verifyEmail
 * @returns {Promise} Contains `void` when resolved.
 */
export const verifyEmail = () =>
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
        .then((_) =>
            firebase.auth().currentUser.sendEmailVerification({
                url: `${emailVerificationUrl}${
                    firebase.auth().currentUser.email
                }`,
            })
        )




/**
 * Apply verification code
 *
 * @function applyVerificationCode
 * @returns {Promise} Contains `void` when resolved.
 */
export const applyVerificationCode = (actionCode) =>
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
        .then((_) => firebase.auth().applyActionCode(actionCode))




/**
 * @function verifyPasswordResetCode
 * @param {String} actionCode
 * @returns {Promise} Contains user's email address `String` when resolved.
 */
export const verifyPasswordResetCode = async (actionCode) =>
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
        .then((_) => firebase.auth().verifyPasswordResetCode(actionCode))
        .catch((error) => {
            return Promise.reject(error)
        })




/**
 * Read once data from _Firebase_ real time database.
 *
 * @function readOnce
 * @param {String} path A relative path from this location to the desired child
 *  location.
 * @returns {Any} _JavaScript_ value read from _DataSnapshot_.
 */
export const readOnce = async (path) => {
    try {
        let snapshot = await firebase.database().ref(path)
            .once("value")
        return snapshot.val()
    } catch (error) {
        return { error: error.message }
    }
}




/**
 * Write to _Firebase_ real time database.
 * @function write
 * @param {String} path A relative path from this location to the desired child
 *  location.
 * @param {Any} data _JavaScript_ value to be written to database.
 * @returns {Object} Contains `ok` or `error` key when succeded/failed.
 */
export const write = async (path, data) => {
    try {
        await firebase.database().ref(path).set(data)
        return { ok: true }
    } catch (error) {
        return { error: error.message }
    }
}




/**
 * Update a value in _Firebase_ real time database.
 *
 * @param {String} path A relative path from this location to the desired child
 *  location.
 * @param {Any} _JavaScript_ value to be written to database.
 */
export const update = async (path, data) => {
    try {
        await firebase.database().ref(path).update(data)
    } catch (error) {
        throw new Error(error)
    }
}




/**
 * Update user's email address.
 * @function updateEmail
 * @param {String} newEmail
 * @returns {Promise} Contains `void` when resolved.
 */
export const updateEmail = (newEmail) =>
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
        .then((_) => firebase.auth().currentUser.updateEmail(newEmail))
        .catch((error) => Promise.reject(error))




/**
 * Reset user's password by sending reset link to user's email.
 *
 * @function resetPassword
 * @param {String} emailAddress
 * @returns {Promise} Contains `void` when resolved.
 */
export const resetPassword = (emailAddress) =>
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
        .then((_) => firebase.auth().sendPasswordResetEmail(emailAddress))
        .catch((error) => Promise.reject(error))




/**
 * Update user's password by confirming valid authorization code.
 *
 * @function updatePassword
 * @param {String} code
 * @param {String} newPassword
 * @returns {Promise} Contains `void` when resolved.
 */
export const updatePassword = (code, newPassword) =>
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
        .then((_) => firebase.auth().confirmPasswordReset(code, newPassword))
        .catch((error) => Promise.reject(error))




/**
 * Update user profile attributes.
 *
 * @function updateUserProfile
 * @param {Object} args A set of arguments pertaining to user's `Profile`
 *  object.
 * @returns {Promise} Contains `void` when resolved.
 */
export const updateUserProfile = (...args) =>
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
        .then((_) => firebase.auth().currentUser.updateProfile(...args))
        .catch((error) => Promise.reject(error))




/**
 * Perform reauthentication when executing sensitive actions.
 *
 * @function reauthenticate
 * @param {String} password
 * @returns {Promise} Contains `UserCredential` object when resolved.
 */
export const reauthenticate = (password) =>
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
        .then((_) => firebase.auth().signInAndRetrieveDataWithCredential(
            new firebase.auth.EmailAuthProvider.credential(
                firebase.auth().currentUser.email, password
            ))
        )
        .catch((error) => Promise.reject(error))




/**
 * Storage reference.
 *
 * @function storageRef
 * @param {String} [path] A relative path to initialize the reference with,
 *  for example path/to/image.jpg. If not passed, the returned reference points
 *  to the bucket root.
 * @returns {Reference} _Firebase_ storage.Reference.
 */
export const storageRef = (path) => firebase.storage().ref(path)
