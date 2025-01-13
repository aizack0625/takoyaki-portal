import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBUGx1_5OX2zk0VPLwMeHZgl1tXhH_ZGDw",
  authDomain: "takoyaki-login.firebaseapp.com",
  projectId: "takoyaki-login",
  storageBucket: "takoyaki-login.firebasestorage.app",
  messagingSenderId: "856566287407",
  appId: "1:856566287407:web:2267571b903cd9121e0ada"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
