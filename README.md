# AC & DC Technical Institute Training Center

A comprehensive web platform for managing a technical training institute, featuring student enrollment, course management, detailed reporting, and a secure certificate verification system.

## Live Demo
- **Vercel**: [AC & DC Technical Institute Training Center](https://acdcinstitute.vercel.app/#/)
- **GitHub Pages**: [AC & DC Technical Institute Training Center](https://umeshjha1998.github.io/TrainingCenter)

## 📌 Developer & AI Documentation
We have established a rigorous structural guide for building new features, updating databases, or utilizing the shadcn/ui framework. 
> 👉 **[Please read the DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) before contributing or prompting AI agents to modify this codebase.**

## Features

### Public Portal
- **Home**: Landing page showcasing available courses, institute details, and contact information.
- **Interactive Map**: Embedded OpenStreetMap via `react-leaflet` in the footer pinpointing the institute's location in Rambhadrapur, Darbhanga, Bihar.
- **Instructors Directory**: Publicly accessible directory (`/instructors`) displaying faculty profiles, expertise, and associated courses with search and filter capabilities.
- **Internationalization**: Site-wide language switching (English, Hindi, Bhojpuri, Maithili) via a custom Google Translate UI component that preserves icons.
- **Login/Register**: Secure authentication for students and administrators, protected by real-time OTP verification.
- **Certificate Verification**: Publicly accessible verification system. Verify issued certificates using a unique Certificate ID or by scanning a QR code.
- **Social Sharing**: One-click sharing of certificates to Email, Facebook, X (Twitter), Reddit, and WhatsApp.

### Student Portal
- **Dashboard**: Real-time high-level overview of profile, enrollment progress, and pending requests.
    - **Progress Tracking**: Dynamic progress bars visualizing course completion based on enrollment date and active duration.
    - **Subject-Level Progress**: Per-subject marks visualization with progress bars showing obtained vs. maximum scores.
- **My Profile**: Dedicated profile widget displaying student photo, contact information (email, phone, address, gender), and registration details (Aadhar, PAN, Passport) — all powered by real-time Firestore listeners for instant updates.
- **Course Enrollment Strategy**: Students can browse available courses and submit an enrollment request directly from their dashboard.
- **My Courses**: Access course materials and progress.
    - **Dropout Functionality**: Students can drop courses they are no longer interested in, with a confirmation prompt.
- **My Requests**: Track the status of enrollment requests (pending, approved, denied) with cancel capability.
- **My Certificates**: View and access all issued certificates directly from the dashboard.
- **Schedule**: View upcoming classes and events (Placeholder).
- **Support**: Contact support for assistance (Placeholder).

### Admin Portal
- **Global Search**: Unified predictive search bar enabling quick navigation to specific Students, Courses, or Certificates from anywhere in the dashboard.
- **Dashboard**: High-level overview of total students, courses, certificates issued, and a real-time "Recent Activity" feed tracking system events.
- **Manage Students**: Full CRUD operations for student records integrated with OTP security for email modifications.
    - **Mandatory Photo Upload**: Student registration requires a normalized profile photo.
    - **Identity Document Fields**: Manage Aadhar, PAN, and Passport details during registration.
    - **Secure Deletion**: Server-side student deletion via a dedicated `/api/admin/delete-student` endpoint powered by `firebase-admin`, performing cascading removal of related enrollment requests, certificates, and Firebase Auth records.
- **Manage Instructors**: Comprehensive CRUD interface for faculty members.
    - **Image Upload**: Seamlessly upload and update professional instructor photos (max 500KB) stored natively as Base64 text in Firestore.
    - **Side-by-Side Modal Layout**: Image upload sits alongside form fields in a responsive grid to eliminate vertical scrolling.
    - **Course Allocation**: Assign and manage course loads for each instructor.
- **Manage Courses**: Create, edit, and delete courses.
    - **Course Duration**: Added support for specifying course duration to feed progress algorithms.
- **Manage Enrollment Requests**: Review, approve, or deny course enrollment requests submitted by students.
- **Manage Certificates**:
    - **Single Generation**: Generate new certificates for students. Select student/course, input marks for subjects, and set a custom issue date and time.
    - **Bulk Generation**: Upload an Excel/CSV file to map students to marks and issue multiple certificates simultaneously.
    - **Management**: View all issued certificates, update existing records, revoke invalid ones.
    - **QR Code**: Automatic generation of QR codes for easy physical verification.
    - **Auto-Email**: Certificates are automatically emailed to students upon generation.
- **Reports**: Visual analytics and system reports.
    - **Charts**: View "Course Popularity" and other metrics using interactive charts.

### Certificate Design
- **Premium Template**: Guilloche-pattern borders, custom SVG institutional logo, and layered gold seal with "Official Certified Institute Seal".
- **Dynamic Grade System**: Color-coded grades (O, A+, A, B+, B, C, F) computed from percentage scores with per-subject color theming.
- **Student Photo**: Polaroid-style student photo embedded on the certificate for identity verification.
- **Elegant Typography**: Custom Google Fonts (Cinzel for headings, Great Vibes for cursive signatures) for a professional look.
- **Print-Optimized**: Pixel-perfect A4 portrait printing with `-webkit-print-color-adjust: exact`, ensuring background colors, tables, QR codes, and signatures are fully preserved in browser print dialogs.

## Recent Updates

- **Interactive Map Integration**: Replaced the static footer address with an interactive OpenStreetMap powered by `react-leaflet` and dynamically imported via `next/dynamic` with SSR disabled. Pinpoints the institute's exact location with a popup marker.
- **Redesigned Certificate Template**: Completely overhauled the Public Certificate View with a new premium design featuring guilloche borders, a layered gold seal, cursive signature typography (Great Vibes font), and a custom SVG institutional logo.
- **Multi-Color Grade System**: Certificate grades are now dynamically color-coded based on percentage thresholds (O/A+/A/B+/B/C/F) with distinct background and text colors per grade tier, while remaining extra-bold and highly visible on screen and in print.
- **Student Photo on Certificates**: Student profile photos are now displayed on certificates in an elegant Polaroid-style frame for identity verification.
- **Comprehensive Student Profiles**: Implemented mandatory photo uploads for students and extended administrative registration to manage Aadhar, PAN, and Passport details. Students can view these real-time on a new "My Profile" dashboard widget.
- **Image Normalization Pipeline**: All user-uploaded images (students and instructors) are processed client-side via `browser-image-compression` through `src/utils/imageProcessor.js` before Base64 storage, ensuring optimized file sizes and consistent dimensions.
- **Server-Side Student Deletion**: Added a secure `/api/admin/delete-student` endpoint using `firebase-admin` for proper cascading deletion of students from Firebase Auth and all related Firestore collections.
- **Instructor Modal Layout Refinement**: Reorganized the instructor add/edit modal to a side-by-side grid layout, placing the image upload next to form fields to prevent vertical scrolling on smaller screens.
- **Enhanced Certificate Printing**: Refactored the Public Certificate View template perfectly for single-page A4 printing. Background colors, CSS layouts, QR codes, marks tables, and signatures accurately persist through browser print dialogs.
- **Social Connectivity**: Added Facebook integration to the global Footer component alongside YouTube, WhatsApp, and Email links.
- **Feature Expansions**: Implemented public Instructors Directory, Course Enrollment Requests workflow with student cancellation, and Bulk Certificate Generation powered by CSV/Excel parser.
- **Real-Time Data Architecture**: Refactored dashboards to use Firebase `onSnapshot` listeners, resulting in immediate UI updates across portals.
- **Framework Migration**: Successfully migrated the entire application from React/Vite to Next.js for better routing, SEO, and performance.
- **Vercel Analytics**: Integrated `@vercel/analytics` and `@vercel/speed-insights` for production monitoring. Configured `.npmrc` (`legacy-peer-deps=true`) for NextAuth compatibility.
- **Robust OTP & Email Infrastructure**: Fixed NodeMailer integration to securely handle OTP dispatch. Certificates are now automatically shared to students via email upon generation.

## Technologies Used

### Frontend & Core
- **Framework**: [Next.js 16](https://nextjs.org/)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Component Library**: [shadcn/ui](https://ui.shadcn.com/) with Radix primitives
- **Visualization**: [Recharts](https://recharts.org/) (for Admin Reports)
- **Icons**: [Lucide React](https://lucide.dev/) + Material Icons
- **Notifications**: [Sonner](https://sonner.emilkowal.dev/) (toast system via shadcn/ui)
- **Theme Management**: [next-themes](https://github.com/pacocoursey/next-themes) (Dark/Light mode)
- **Maps**: [react-leaflet](https://react-leaflet.js.org/) + [Leaflet](https://leafletjs.com/)
- **Animations**: [tw-animate-css](https://www.npmjs.com/package/tw-animate-css)

### Backend & Services
- **Backend-as-a-Service**: [Firebase](https://firebase.google.com/)
  - **Authentication**: Secure user login/registration.
  - **Firestore Database**: Real-time database for storing users, courses, and certificates.
  - **Firebase Admin SDK**: Server-side user management (student deletion with cascading cleanup).
  - **Firebase Storage**: Legacy/optional cloud storage for larger media assets (profile photos have been migrated to native Firestore Base64 encoding).
- **Session Management**: [NextAuth.js](https://next-auth.js.org/)
- **Email Delivery**: Custom internal Next.js `send-otp` Route handling NodeMailer dispatches.
- **Image Processing**: [browser-image-compression](https://www.npmjs.com/package/browser-image-compression) (client-side normalization before storage).
- **Spreadsheet Parsing**: [SheetJS (xlsx)](https://sheetjs.com/) (for bulk certificate CSV/Excel imports).

### Utilities
- **QR Code Generation**: `qrcode.react`
- **CSS Utilities**: `clsx`, `tailwind-merge`, `class-variance-authority`
- **Production Monitoring**: `@vercel/analytics`, `@vercel/speed-insights`

## Setup Instructions

Follow these steps to set up the project locally on your machine.

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/umeshjha1998/TrainingCenter.git
    cd TrainingCenter
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env.local` file at the root to hold your credentials:
    ```
    SMTP_USER=your-email@gmail.com
    SMTP_PASS=your-app-password
    # SMTP_HOST=smtp.gmail.com
    # SMTP_PORT=587
    FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
    ```
    *(If no SMTP ENV is supplied, the app will safely run in DEV MODE and print OTPs via browser alerts)*
    *(FIREBASE_SERVICE_ACCOUNT_KEY is required only for server-side student deletion in production)*

4.  **Configure Firebase:**
    - Create a new project in the [Firebase Console](https://console.firebase.google.com/).
    - Enable **Authentication** (Email/Password).
    - Enable **Firestore Database** (Start in Test Mode).
    - Register a web app in your Firebase project and update `src/firebase.js` with your config keys.

5.  **Run the development server:**
    ```bash
    npm run dev
    ```

6.  **Open in browser:**
    Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
TrainingCenter/
├── src/
│   ├── app/                  # Next.js App Router (pages, layouts, API routes)
│   │   ├── api/              # Server API endpoints (send-otp, admin/delete-student)
│   │   ├── c/                # Public certificate verification route (/c/[id])
│   │   ├── instructors/      # Public instructors directory
│   │   ├── admin/            # Admin dashboard routes
│   │   ├── student-dashboard/ # Student portal routes
│   │   └── ...
│   ├── components/
│   │   ├── admin/            # Admin-specific components
│   │   ├── certificate/      # CertificateTemplate.jsx
│   │   ├── common/           # Shared components (Footer, Navbar, MapEmbedded, GoogleTranslate, ThemeToggle)
│   │   ├── student/          # Student layout components
│   │   ├── providers/        # Context providers
│   │   └── ui/               # shadcn/ui primitives
│   ├── screens/
│   │   ├── admin/            # Admin screens (Dashboard, ManageStudents, etc.)
│   │   ├── student/          # StudentDashboard.jsx
│   │   └── ...               # Public screens (Home, Login, Register, etc.)
│   ├── utils/                # Utilities (imageProcessor.js)
│   ├── hooks/                # Custom React hooks
│   └── firebase.js           # Firebase client initialization
├── DEVELOPER_GUIDE.md        # Central AI/Developer documentation
├── package.json
└── ...
```

## License

This project is licensed under the MIT License.
