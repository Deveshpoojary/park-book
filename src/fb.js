// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBKRttzKCgHicM9F1R4zAUWSnGLv5JcxJs",
  authDomain: "parking-bf79c.firebaseapp.com",
  projectId: "parking-bf79c",
  storageBucket: "parking-bf79c.appspot.com",
  messagingSenderId: "925640975953",
  appId: "1:925640975953:web:ed0b617a6b8d07be88fa70",
  measurementId: "G-VB2VHC3CN8"
};

// Initialize Firebase
const fapp = initializeApp(firebaseConfig);
const db = getFirestore(fapp);
export  {fapp,db};
