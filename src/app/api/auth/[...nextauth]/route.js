import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../../../firebase";
import { doc, getDoc } from "firebase/firestore";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
                role: { label: "Role", type: "text" } // Pass "admin" when logging in as admin
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Missing email or password");
                }

                // Temporary solution for Admin (since earlier code used hardcoded credentials)
                if (credentials.role === "admin") {
                    if (credentials.email === "admin" && credentials.password === "admin") {
                        // Return admin user object
                        return {
                            id: "admin",
                            uid: "admin",
                            email: "admin@console.local",
                            name: "Administrator",
                            role: "admin"
                        };
                    } else {
                        throw new Error("Invalid admin credentials");
                    }
                }

                try {
                    // Authenticate Student via Firebase Client Auth
                    const userCredential = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
                    const user = userCredential.user;

                    if (user) {
                        // Fetch Role from Firestore
                        const docRef = doc(db, "users", user.uid);
                        const docSnap = await getDoc(docRef);

                        let role = "student"; // Default
                        if (docSnap.exists() && docSnap.data().role) {
                            role = docSnap.data().role;
                        }

                        return {
                            id: user.uid,
                            uid: user.uid,
                            email: user.email,
                            role: role
                        };
                    }
                } catch (error) {
                    throw new Error(error.message || "Authentication failed");
                }

                return null;
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            // Initial sign in
            if (user) {
                token.role = user.role;
                token.uid = user.uid || user.id;
            }
            return token;
        },
        async session({ session, token }) {
            // Send properties to the client, like an access_token and user id from a provider.
            if (session.user) {
                session.user.role = token.role;
                session.user.uid = token.uid;
            }
            return session;
        }
    },
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    secret: process.env.NEXTAUTH_SECRET || "acdc-institute-very-secret-key-for-dev",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
