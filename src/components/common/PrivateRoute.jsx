"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function PrivateRoute({ children, adminOnly = false }) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "loading") return;

        if (status === "unauthenticated") {
            router.push(adminOnly ? "/admin-login" : "/login");
        } else if (status === "authenticated") {
            const isAdmin = session?.user?.role === "admin";
            if (adminOnly && !isAdmin) {
                router.push("/student-dashboard");
            }
        }
    }, [status, session, adminOnly, router]);

    if (status === "loading") {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (status === "unauthenticated") {
        return null;
    }

    const isAdmin = session?.user?.role === "admin";
    if (adminOnly && !isAdmin) {
        return null; // Don't render if it's an admin route and user isn't admin
    }

    return children;
}
