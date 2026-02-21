"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";

export default function PrivateRoute({ children, adminOnly = false }) {
    const { currentUser, isAdmin } = useAuth();

    const router = useRouter();

    useEffect(() => {
        if (!currentUser) {
            router.push(adminOnly ? "/admin-login" : "/login");
        } else if (adminOnly && !isAdmin) {
            router.push("/student-dashboard");
        }
    }, [currentUser, isAdmin, adminOnly, router]);

    if (!currentUser || (adminOnly && !isAdmin)) {
        return null;
    }

    return children;
}
