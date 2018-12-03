import { config } from "./config"
import firebase from "firebase/app"
import "firebase/auth"
import "firebase/database"
import "firebase/storage"




// initialize Firebase app
if (!firebase.apps.length) {
    firebase.initializeApp(config.firebase)
}




// Authenticate with Firebase email/password
const authenticate = (email, password) =>
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
        .then((_) => firebase.auth()
            .signInWithEmailAndPassword(email, password)
        )
        .catch((error) => {
            return Promise.reject(error)
        })




// Sign out the user from Firebase
const signout = () => firebase.auth().signOut()




// Signup new user with Firebase
const signup = (email, password) =>
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
        .then((_) => firebase.auth()
            .createUserWithEmailAndPassword(email, password)
        )
        .catch((error) => {
            return Promise.reject(error)
        })




// Send verification email
const verifyEmail = () =>
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
        .then((_) =>
            firebase.auth().currentUser.sendEmailVerification({
                url: `https://localhost/?email=${
                    firebase.auth().currentUser.email
                }`,
            })
        )




// Apply verification code
const applyVerificationCode = (actionCode) =>
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
        .then((_) => firebase.auth().applyActionCode(actionCode))




// Verify password reset code
const verifyPasswordResetCode = async (actionCode) =>
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
        .then((_) => firebase.auth().verifyPasswordResetCode(actionCode))
        .catch((error) => {
            return Promise.reject(error)
        })




// ...
const read = async (uid) => {
    try {
        let snapshot = await firebase.database().ref(`user/${uid}`)
            .once("value")
        return { user: snapshot.val() }
    } catch (error) {
        return { error: error.message }
    }
}




// ...
const write = async (path, userData) => {
    try {
        await firebase.database().ref(path).set(userData)
        return { ok: true }
    } catch (error) {
        return { error: error.message }
    }
}




// Update user email
const updateEmail = (newEmail) =>
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
        .then((_) => firebase.auth().currentUser.updateEmail(newEmail))
        .catch((error) => Promise.reject(error))




// Send password reset link.
const resetPassword = (emailAddress) =>
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
        .then((_) => firebase.auth().sendPasswordResetEmail(emailAddress))
        .catch((error) => Promise.reject(error))




// Send password reset link.
const updatePassword = (code, newPassword) =>
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
        .then((_) => firebase.auth().confirmPasswordReset(code, newPassword))
        .catch((error) => Promise.reject(error))




// Update user attributes
const updateUserProfile = (...args) =>
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
        .then((_) => firebase.auth().currentUser.updateProfile(...args))
        .catch((error) => Promise.reject(error))




// Reauthenticate
const reauthenticate = (password) =>
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
        .then((_) => firebase.auth().signInAndRetrieveDataWithCredential(
            new firebase.auth.EmailAuthProvider.credential(
                firebase.auth().currentUser.email, password
            ))
        )
        .catch((error) => Promise.reject(error))


// Storage Reference
const storageRef = () => firebase.storage().ref()



// ...
export {
    applyVerificationCode, authenticate, read, resetPassword, signout, signup,
    updateEmail, updatePassword, updateUserProfile, verifyEmail,
    verifyPasswordResetCode, write, reauthenticate, storageRef,
}
