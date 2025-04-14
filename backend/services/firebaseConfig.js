const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore');
const { getAuth } = require('firebase/auth');
require('dotenv').config();

const firebaseConfig = {
    apiKey: "AIzaSyAvIXH_Sv7ZhOVvyD3cPzhY6l-q-UuWl0w",
    authDomain: "brillare-4e30d.firebaseapp.com",
    projectId: "brillare-4e30d",
    storageBucket: "brillare-4e30d.firebasestorage.app",
    messagingSenderId: "937443763136",
    appId: "1:937443763136:web:6acbbe5d8c65ddfc86de25",
    measurementId: "G-X8KX0Z97F8"
  };
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

module.exports = { db, auth };
