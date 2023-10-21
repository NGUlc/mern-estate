// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-dc480.firebaseapp.com",
  projectId: "mern-estate-dc480",
  storageBucket: "mern-estate-dc480.appspot.com",
  messagingSenderId: "638203983228",
  appId: "1:638203983228:web:7c12616267b50f14ba20f9"
};

// Initialize Firebase
 export const app = initializeApp(firebaseConfig);