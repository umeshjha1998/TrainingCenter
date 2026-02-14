import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [userRole, setUserRole] = useState(null); // 'admin', 'student', or null
    const [loading, setLoading] = useState(true);

    const [adminOverride, setAdminOverride] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (adminOverride) return; // Ignore firebase updates if admin is logged in manually

            setCurrentUser(user);
            if (user) {
                // Fetch user role from Firestore
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setUserRole(docSnap.data().role);
                } else {
                    setUserRole("student"); // Default role
                }
            } else {
                setUserRole(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, [adminOverride]);

    const loginAsAdmin = (username, password) => {
        if (username === "admin" && password === "admin") {
            setAdminOverride(true);
            setCurrentUser({ uid: "admin", email: "admin@console.local", displayName: "Administrator" });
            setUserRole("admin");
            return true;
        }
        return false;
    };

    const logout = () => {
        if (adminOverride) {
            setAdminOverride(false);
            setCurrentUser(null);
            setUserRole(null);
            // Re-trigger firebase auth check might be good, but for now simple clear is fine.
            // onAuthStateChanged will pick up usually.
            // Actually, we should check if firebase user is still there? 
            // Simplified: just clear and let the user re-login if needed.
            return Promise.resolve();
        }
        return auth.signOut();
    }

    const value = {
        currentUser,
        userRole,
        isAdmin: userRole === "admin",
        loginAsAdmin,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
