import * as firebase from 'firebase'
import 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyAHcWxVNFSjBabMPP91GiOAdL46UcUoqiU",
    authDomain: "test-ab3ea.firebaseapp.com",
    databaseURL: "https://test-ab3ea-default-rtdb.firebaseio.com",
    projectId: "test-ab3ea",
    storageBucket: "test-ab3ea.appspot.com",
    messagingSenderId: "520113904110",
    appId: "1:520113904110:web:6d0faad6477fd74d5b16ff",
    measurementId: "G-8ZJE81V3MY"
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

export default firebase