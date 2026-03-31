import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyAcwgQAwzTRUNt2buoTv4mcntthu8imOoY",
  authDomain: "mokshpath-dd7ca.firebaseapp.com",
  projectId: "mokshpath-dd7ca",
  storageBucket: "mokshpath-dd7ca.firebasestorage.app",
  messagingSenderId: "472395816286",
  appId: "1:472395816286:web:75a68e5b3790ce04aac3cf"
};

const app = initializeApp(firebaseConfig);

export const messaging = getMessaging(app);