// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBATB8jiXaS6jJ1-Fo83RSj3rYLTfbAPGw',
  authDomain: 'dairyflow-c0105.firebaseapp.com',
  projectId: 'dairyflow-c0105',
  storageBucket: 'dairyflow-c0105.firebasestorage.app',
  messagingSenderId: '171585210897',
  appId: '1:171585210897:web:189c5aa8b5ba797240ffb0',
  measurementId: 'G-TM5TC4K8R7',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
