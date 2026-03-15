import admin from "firebase-admin";

if (!admin.apps.length) {
    try {
        const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY 
            ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
            : null;

        if (serviceAccount) {
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "ac-dc-tech-institute-prod-v1"
            });
            console.log("Firebase Admin initialized with service account.");
        } else {
            // Fallback for development if using ADC or local emulator
            admin.initializeApp({
                projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "ac-dc-tech-institute-prod-v1"
            });
            console.warn("Firebase Admin initialized without service account. Auth operations may fail in production.");
        }
    } catch (error) {
        console.error("Firebase Admin initialization error:", error);
    }
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();
export default admin;
