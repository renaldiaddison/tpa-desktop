import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBI2-yFbd1_UfQ_CSjWwoyfdK3LHN8MDBM",
  authDomain: "chello-478d6.firebaseapp.com",
  projectId: "chello-478d6",
  storageBucket: "chello-478d6.appspot.com",
  messagingSenderId: "428823219933",
  appId: "1:428823219933:web:0245fccad73d3dd75c1534",
  measurementId: "G-WFMLPHF4SJ"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore();
export default app;