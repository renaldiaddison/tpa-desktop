import { createContext, useContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useLocation, useNavigate } from "react-router-dom";
import {
  addDoc,
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase-config";

const userAuthContext = createContext();

export function UserAuthContextProvider({ children }) {
  const auth = getAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState();
  const [userData, setUserData] = useState();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      const userRef = collection(db, "user");
      const q = query(userRef, where("userId", "==", currentUser.uid));
      const querySnapShot = await getDocs(q);

      querySnapShot.forEach((doc) => {
        setUserData(doc.data());
      });
    });
    return () => {
      unsubscribe();
    };
  }, [location]);

  return (
    <userAuthContext.Provider value={{ user, userData }}>
      {children}
    </userAuthContext.Provider>
  );
}

export function useUserAuth() {
  return useContext(userAuthContext);
}
