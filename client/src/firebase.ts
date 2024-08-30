import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: import.meta.env.VITE_AUTHDOMAIN,
  projectId: import.meta.env.VITE_PROJECTID,
  storageBucket: import.meta.env.VITE_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGINGSENDERID,
  appId: import.meta.env.VITE_APPID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const firestore = getFirestore(app);

export { db, auth, provider, signInWithPopup, signOut, onAuthStateChanged, firestore };


// ユーザー情報をFirestoreに登録
export const registerUser = async (user: any) => {
    const userDoc = doc(db, 'users', user.uid);
    await setDoc(userDoc, {
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
    });
  };
  
  // ユーザー情報をFirestoreから取得
  export const getUserFromFirestore = async (uid: string) => {
    const userDoc = doc(db, 'users', uid);
    const docSnap = await getDoc(userDoc);
    return docSnap.exists() ? docSnap.data() : null;
  };