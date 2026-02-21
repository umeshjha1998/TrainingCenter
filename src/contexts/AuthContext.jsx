"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext({
    currentUser: null,
    userRole: null,
    isAdmin: false,
    loginAsAdmin: () => false,
    logout: () => Promise.resolve()
});

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [userRole, setUserRole] = useState(null); // 'admin', 'student', or null
    const [loading, setLoading] = useState(true);

    const [adminOverride, setAdminOverride] = useState(() => {
        // Check session storage for admin persistence safely
        if (typeof window !== "undefined") {
            return sessionStorage.getItem('adminSession') === 'true';
        }
        return false;
    });

    // Immediate check on mount/update of adminOverride
    useEffect(() => {
        if (adminOverride) {
            // Force set admin user immediately if not set
            if (!currentUser || currentUser.uid !== "admin") {
                setCurrentUser({ uid: "admin", email: "admin@console.local", displayName: "Administrator" });
                setUserRole("admin");
            }
            // Ensure loading is false
            setLoading(false);
        }
    }, [adminOverride, currentUser]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            // If admin is active, ignore Firebase Auth updates (forces admin state persistence)
            if (adminOverride) {
                return;
            }

            setCurrentUser(user);
            if (user) {
                // Fetch user role from Firestore
                try {
                    const docRef = doc(db, "users", user.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setUserRole(docSnap.data().role);
                    } else {
                        setUserRole("student"); // Default role
                    }
                } catch (error) {
                    console.error("Error fetching user role:", error);
                    setUserRole("student"); // Fallback
                }
            } else {
                setUserRole(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, [adminOverride]); // Re-run if admin status changes

    const loginAsAdmin = (username, password) => {
        if (username === "admin" && password === "admin") {
            sessionStorage.setItem('adminSession', 'true');
            setAdminOverride(true);
            setCurrentUser({ uid: "admin", email: "admin@console.local", displayName: "Administrator" });
            setUserRole("admin");
            return true;
        }
        return false;
    };

    const logout = async () => {
        if (adminOverride) {
            sessionStorage.removeItem('adminSession');
            setAdminOverride(false);
            setCurrentUser(null);
            setUserRole(null);
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
