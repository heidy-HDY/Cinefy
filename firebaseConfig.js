import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBQE_LG0N-IsxT_3cVj5Y_6JBXGbkpB-o8",
  authDomain: "cinefy-c1a9b.firebaseapp.com",
  projectId: "cinefy-c1a9b",
  storageBucket: "cinefy-c1a9b.appspot.com",
  messagingSenderId: "372685346076",
  appId: "1:372685346076:web:4d0e017ffcb8ac8bf7d6d9",
  measurementId: "G-2QJHX6SN2N"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

