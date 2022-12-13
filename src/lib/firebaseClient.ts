// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyC7L-OCwdrFIHJOHZW8yhoH_l6Aqxt0Vmg',
  authDomain: 'yt-content-ideas.firebaseapp.com',
  projectId: 'yt-content-ideas',
  storageBucket: 'yt-content-ideas.appspot.com',
  messagingSenderId: '1099089811221',
  appId: '1:1099089811221:web:4f5efde18385d35466fb1c',
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const auth = getAuth();
const storage = getStorage();

export { app, auth, db, storage };
