import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBoouVB5yrmkgZeFTzBadj7XpzbBGNlz7s",
    authDomain: "ac-dc-tech-institute-prod-v1.firebaseapp.com",
    projectId: "ac-dc-tech-institute-prod-v1",
    storageBucket: "ac-dc-tech-institute-prod-v1.firebasestorage.app",
    messagingSenderId: "234050604622",
    appId: "1:234050604622:web:cfa7456d9087ae6d55fd1f"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
