// firebaseConfig.js

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBEYuyL8rGpErFGnaU5oy4zTrEYOvWuPuI",
  authDomain: "campready-41a9d.firebaseapp.com",
  projectId: "campready-41a9d",
  storageBucket: "campready-41a9d.appspot.com",
  messagingSenderId: "36346834567",
  appId: "1:36346834567:web:60c830041b3a7f76e3d222",
  measurementId: "G-3F6EQ1VDEX"
};


firebase.initializeApp(firebaseConfig);

export default firebase;
