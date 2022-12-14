import { onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth } from "../firebaseConfig";

export const authContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(localStorage.getItem('user')===undefined ? null: JSON.parse(localStorage.getItem('user')));
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser( localStorage.setItem('user', JSON.stringify(user)))
      setCurrentUser(user);
     
    });
    return () => {
      unsub();
    };
  }, []);
  return (
    <authContext.Provider value={{ currentUser , setCurrentUser }}>
      {children}
    </authContext.Provider>
  );
};
