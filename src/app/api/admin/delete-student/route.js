import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebaseAdmin';

export async function POST(request) {
    try {
        const { uid } = await request.json();

        if (!uid) {
            return NextResponse.json({ success: false, error: 'UID is required' }, { status: 400 });
        }

        // Note: In a real production app, we should verify that the requester is an admin
        // using their session token / custom claims.
        
        await adminAuth.deleteUser(uid);
        console.log(`Successfully deleted user ${uid} from Firebase Auth`);

        return NextResponse.json({ success: true, message: 'User deleted from Auth successfully' });
    } catch (error) {
        console.error("Error deleting user from Auth:", error);
        
        // If user already deleted, we count it as success for the cascade
        if (error.code === 'auth/user-not-found') {
            return NextResponse.json({ success: true, message: 'User already removed from Auth' });
        }

        return NextResponse.json({ 
            success: false, 
            error: error.message || 'Failed to delete user from Auth. Ensure service account is configured.' 
        }, { status: 500 });
    }
}
