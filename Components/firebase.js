import * as firebase from 'firebase'
import 'firebase/firestore'



const firebaseConfig = {

    apiKey: "AIzaSyB_U3B2wsCbjps8VD5EYrfFlOHYRKL_5Us",
    authDomain: "lenin-database.firebaseapp.com",
    projectId: "lenin-database",
    storageBucket: "lenin-database.appspot.com",
    messagingSenderId: "912644963882",
    appId: "1:912644963882:web:f4a82e57b103b3dac38d53"

  };

  

let app
if (!firebase.apps.length) {
    app = firebase.initializeApp(firebaseConfig)
} else {
    app = firebase.app()
}

export const db = app.firestore()

export const storage = firebase.storage()

export const storageRef = firebase.storage().ref();

export const auth = firebase.auth()

export default firebase