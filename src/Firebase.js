
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAZi6mXiCl2CppkHM824JJbuezbg9G7ojI",
  authDomain: "sbp0902-722eb.firebaseapp.com",
  projectId: "sbp0902-722eb",
  storageBucket: "sbp0902-722eb.appspot.com",
  messagingSenderId: "769236072848",
  appId: "1:769236072848:web:7b29c1da7368246b589b15"
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { app, firestore };