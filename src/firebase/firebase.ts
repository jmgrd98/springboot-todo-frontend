// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCkQ8Cu4pls1mxJ_L56SP0MhpyiGhcj3qs",
  authDomain: "todo-d1377.firebaseapp.com",
  projectId: "todo-d1377",
  storageBucket: "todo-d1377.appspot.com",
  messagingSenderId: "831813938818",
  appId: "1:831813938818:web:d46e8a0a0c838bfd40ce9b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);