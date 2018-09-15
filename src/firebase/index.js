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
// .then((_) => console.log("User signed out from Firebase."))




// Signup new user with Firebase
const signup = (email, password) =>
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
        .then((_) => firebase.auth()
            .createUserWithEmailAndPassword(email, password)
        )


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

// ...
export { authenticate, read, signout, signup, write, }
