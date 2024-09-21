import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAEGTDBH_KBzgvBBlnO09JdFTH-2IteroA",
  authDomain: "proj-list-r-native.firebaseapp.com",
  databaseURL: "https://proj-list-r-native-default-rtdb.firebaseio.com",
  projectId: "proj-list-r-native",
  storageBucket: "proj-list-r-native.appspot.com",
  messagingSenderId: "266686932970",
  appId: "1:266686932970:web:ab336d404384bb3bd3b493",
};

export const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
// Initialize Firebase
export const db = getFirestore(app);

export const storage = getStorage(app);


