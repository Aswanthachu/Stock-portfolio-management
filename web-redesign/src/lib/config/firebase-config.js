// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithRedirect } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAvNCwIKVMLXMSem4Xe1RDG0wD7RWksOn8",
  authDomain: "kks-capitals.firebaseapp.com",
  projectId: "kks-capitals",
  storageBucket: "kks-capitals.appspot.com",
  messagingSenderId: "805752999293",
  appId: "1:805752999293:web:b69aa303b02f1efda25014",
  measurementId: "G-1RC1PFT0BB",
};

export const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
googleProvider.addScope("email");

// new codes
googleProvider.setCustomParameters({
  prompt: "select_account",
});

export const signInWithGoogleRedirect = () =>
  signInWithRedirect(auth, googleProvider);

export { auth, googleProvider };
