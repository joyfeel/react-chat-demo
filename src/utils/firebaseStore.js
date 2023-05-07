import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyAJoyswb6WFU0XHHzzlRIJIeP3kYLHHgRU",
    authDomain: "react-chat-63e54.firebaseapp.com",
    projectId: "react-chat-63e54",
    storageBucket: "react-chat-63e54.appspot.com",
    messagingSenderId: "425232611107",
    appId: "1:425232611107:web:a3f5d6a93c8fa20ad47e96"
}

export const firebaseApp = initializeApp(firebaseConfig)
export const fireStore = getFirestore(firebaseApp)