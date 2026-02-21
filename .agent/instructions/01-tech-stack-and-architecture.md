# Tech Stack & Architecture

This document describes the foundational technologies and architectural choices for the AC & DC Technical Institute Training Center application. Agents working on this project must adhere to these choices unless explicitly instructed by the user to migrate or change them.

## Core Technologies
- **Framework**: Next.js 16 (Migrated from React/Vite)
- **UI & Styling**: Tailwind CSS v4, utilizing utility classes for responsive design.
- **Backend as a Service (BaaS)**: Firebase
  - **Authentication**: Firebase Auth (Email & Password, Custom claims/roles logic for Admin vs Student).
  - **Database**: Firebase Firestore (NoSQL Document database).
- **Email Delivery**: Custom integration using `nodemailer` (v8.0.1) deployed as Next.js API Routes (e.g., `/api/send-otp`).
- **Icons & Graphics**: Standard web icons, dynamically generated QR codes using `qrcode.react`.
- **Analytics**: Vercel Analytics and Vercel Speed Insights integratons.
- **Charts**: Recharts for administering visual metrics on the dashboard.

## Application Structure
- **Frontend Segments**:
  - `Public Portal`: Open to non-authenticated users. Includes Landing page, About Us, Global Certificate Verification page.
  - `Student Portal`: Requires Student authentication. Displays progress, enrolled courses, and grades.
  - `Admin Portal`: Requires Admin authentication. Provides full CRUD over the system entities, analytics, and certificate generation.
- **Authentication Flow**:
  1. Users register and receive an OTP via email (`nodemailer` route).
  2. OTP is verified client/server side, then the user proceeds to final creation in Firebase Auth.
  3. Student accounts are created in the Firestore database linked to their Auth UID.
  4. Admins are either pre-defined or flagged inside Firestore by role.

## Dependency Management & Deployment Environment
- **Node Environment**: The app runs on standard Node.js environments (v18+).
- **Deployment Platform**: Vercel (Production) & GitHub Pages (Staging/Fallback).
- **Package Manager**: npm. Due to peer dependency conflicts between `next-auth` and `nodemailer`, the `.npmrc` sets `legacy-peer-deps=true`. Do NOT remove this without resolving the underlying dependency conflict first.

---
*Note: If the user requests adding new libraries or changing the framework, update this document to reflect those changes.*
