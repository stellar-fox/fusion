import { config } from "./config"
import firebase from "firebase/app"
import "firebase/auth"



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
const signOut = () => firebase.auth().signOut()
// .then((_) => console.log("User signed out from Firebase."))




// ...
export { authenticate, signOut, }
