import { config } from "./config"
import firebase from "firebase/app"
import "firebase/auth"
import "firebase/database"



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


// Sign out the user from Firebase
const signout = () => firebase.auth().signOut()


// Signup new user with Firebase
const signup = (email, password) =>
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
        .then((_) => firebase.auth()
            .createUserWithEmailAndPassword(email, password)
        )


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
const verifyPasswordResetCode = (actionCode) =>
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
        .then((_) => firebase.auth().verifyPasswordResetCode(actionCode))


// ...
const read = async (uid) => {
    try {
        let snapshot = await firebase.database().ref(`user/${uid}`)
            .once("value")
        return { user: snapshot.val(), }
    } catch (error) {
        return { error: error.message, }
    }
}


// ...
const write = async (uid, userData) => {
    try {
        await firebase.database().ref(`user/${uid}`).set(userData)
        return { ok: true, }
    } catch (error) {
        return { error: error.message, }
    }
}


// Send password reset link.
const resetPassword = (emailAddress) =>
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
        .then((_) => firebase.auth().sendPasswordResetEmail(emailAddress))


// Send password reset link.
const updatePassword = (code, newPassword) =>
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
        .then((_) => firebase.auth().confirmPasswordReset(code, newPassword))




// ...
export {
    applyVerificationCode, authenticate, read, resetPassword, signout, signup,
    updatePassword, verifyEmail, verifyPasswordResetCode, write,
}
