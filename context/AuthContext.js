import React, { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, firestore } from "@/infra/firebase"; // Importa Firestore
import { router } from "expo-router";
import { Provider as PaperProvider, DarkTheme as DarkPaperTheme, DefaultTheme as LightPaperTheme } from "react-native-paper";
import { doc, getDoc, setDoc } from "firebase/firestore";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userAuth, setUserAuth] = useState(null);
  const [isDarkTheme, setIsDarkTheme] = useState(false); 

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
    console.log("Tema atual:", isDarkTheme);
  };

  const theme = isDarkTheme ? DarkPaperTheme : LightPaperTheme;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setUserAuth(user);
      setLoading(false);
      if (user) {
        router.push("/(tabs)");
      } else {
        router.push("/login");
      }
    });

    return unsubscribe;
  }, []);

  

  const createUserProfile = async (user) => {
    const userRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userRef);
    if (!docSnap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        displayName: user.displayName || "",
        email: user.email,
        username: "", 
        photoURL: user.photoURL || "",
      });
      console.log("Documento criado com sucesso!");
      return { uid: user.uid, displayName: user.displayName, email: user.email, username: "", photoURL: user.photoURL };
    }

    return docSnap.data();
  };

  const logout = () => {
    setUserAuth(null);
    return signOut(auth);
  };

  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await createUserProfile(user);

    return userCredential;
  };

  const register = async (email, password) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await createUserProfile(user);

    return userCredential;
  };

  const value = {
    currentUser,
    logout,
    login,
    register,
    toggleTheme, 
    isDarkTheme, 
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && (
        <PaperProvider theme={theme}>
          {children}
        </PaperProvider>
      )}
    </AuthContext.Provider>
  );
};
