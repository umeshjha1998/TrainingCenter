import "./globals.css";
import React from 'react';
import { AuthProvider } from '../components/providers/AuthProvider';
import { ThemeProvider } from '../components/providers/ThemeProvider';
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata = {
    title: "A.C. & D.C. Technical Institute",
    description: "Training center for AC & DC Technical Institute",
};

import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link rel="icon" type="image/svg+xml" href="/vite.svg" />

                {/* Google Fonts and Material Icons */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
                <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
            </head>
            <body className="antialiased text-slate-900 bg-white dark:bg-slate-900 dark:text-slate-50">
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                    <AuthProvider>
                        {children}
                    </AuthProvider>
                </ThemeProvider>
                <Toaster richColors closeButton position="top-right" />
                <Analytics />
                <SpeedInsights />
            </body>
        </html>
    );
}
