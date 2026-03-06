# AC & DC Technical Institute Training Center

A comprehensive web platform for managing a technical training institute, featuring student enrollment, course management, detailed reporting, and a secure certificate verification system.

## Live Demo
- **Vercel**: [AC & DC Technical Institute Training Center](https://acdcinstitute.vercel.app/#/)
- **GitHub Pages**: [AC & DC Technical Institute Training Center](https://umeshjha1998.github.io/TrainingCenter)

## Features

### Public Portal
- **Home**: Landing page showcasing available courses, institute details, and contact information.
- **Instructors Directory**: Publicly accessible directory (`/instructors`) displaying faculty profiles, expertise, and associated courses with search and filter capabilities.
- **Internationalization**: Site-wide language switching (English, Hindi, Bhojpuri, Maithili) via a custom Google Translate UI component that preserves icons.
- **Login/Register**: Secure authentication for students and administrators, protected by real-time OTP verification.
- **Certificate Verification**: Publicly accessible verification system. Verify issued certificates using a unique Certificate ID or by scanning a QR code.
- **Social Sharing**: One-click sharing of certificates to Email, Facebook, X (Twitter), Reddit, and WhatsApp.

### Student Portal
- **Dashboard**: Real-time high-level overview of profile, enrollment progress, and pending requests.
    - **Progress Tracking**: Dynamic progress bars visualizing course completion based on enrollment date and active duration.
- **Course Enrollment Strategy**: Students can browse available courses and submit an enrollment request directly from their dashboard.
- **My Courses**: Access course materials and progress.
    - **Dropout Functionality**: Students can drop courses they are no longer interested in, with a confirmation prompt.
- **Schedule**: View upcoming classes and events (Placeholder).
- **Support**: Contact support for assistance (Placeholder).

### Admin Portal
- **Global Search**: Unified predictive search bar enabling quick navigation to specific Students, Courses, or Certificates from anywhere in the dashboard.
- **Dashboard**: High-level overview of total students, courses, certificates issued, and a real-time "Recent Activity" feed tracking system events.
- **Manage Students**: Full CRUD operations for student records integrated with OTP security for email modifications.
- **Manage Instructors**: comprehensive CRUD interface and course assignment allocation for faculty members.
- **Manage Courses**: Create, edit, and delete courses.
    - **Course Duration**: Added support for specifying course duration to feed progress algorithms.
- **Manage Enrollment Requests**: Review, approve, or deny course enrollment requests submitted by students.
- **Manage Certificates**:
    - **Single Generation**: Generate new certificates for students. Select student/course, input marks for subjects, and set a custom issue date and time.
    - **Bulk Generation**: Upload an Excel/CSV file to map students to marks and issue multiple certificates simultaneously.
    - **Management**: View all issued certificates, update existing records, revoke invalid ones.
    - **QR Code**: Automatic generation of QR codes for easy physical verification.
- **Reports**: Visual analytics and system reports.
    - **Charts**: View "Course Popularity" and other metrics using interactive charts.

## Recent Updates

- **Feature Expansions**: Implemented public Instructors Directory, Course Enrollment Requests workflow with student cancellation, and Bulk Certificate Generation powered by CSV/Excel parser.
- **Real-Time Data Architecture**: Refactored dashboards to use Firebase `onSnapshot` listeners, resulting in immediate UI updates across portals.
- **Framework Migration**: Successfully migrated the entire application from React/Vite to Next.js for better routing, SEO, and performance.
- **Vercel Analytics**: Integrated `@vercel/analytics` and `@vercel/speed-insights` for production monitoring. Configured `.npmrc` (`legacy-peer-deps=true`) for NextAuth compatibility.
- **Student Dashboard Enhancements**: Enrolled course images display properly with maximum/obtained marks. Assigned courses appear instantly, and students can browse, request, and cancel enrollment for available courses seamlessly.
- **Robust OTP & Email Infrastructure**: Fixed NodeMailer integration to securely handle OTP dispatch. Certificates are now automatically shared to students via email upon generation.
- **UI/UX Quality of Life**: Added a global dark mode toggle with cross-theme text visibility (Day Mode fixes). Fixed mobile clipping for language selectors and logout buttons. Resolved broken navigation links, fixed "View Certificate" visibility in Day Mode, and improved forms aligned with Stitch designs.
- **Premium Public Certificate View**: Integrated complex marks table metrics with formal guilloche designs to correctly translate Stitch templates into dynamic React components via direct URL IDs (`/c/<certificateId>`).

## Technologies Used

### Frontend & Core
- **Framework**: [Next.js 16](https://nextjs.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Visualization**: [Recharts](https://recharts.org/) (for Admin Reports)

### Backend & Services
- **Backend-as-a-Service**: [Firebase](https://firebase.google.com/)
  - **Authentication**: Secure user login/registration.
  - **Firestore Database**: Real-time database for storing users, courses, and certificates.
- **Email Delivery**: Custom internal Next.js `send-otp` Route handling NodeMailer dispatches.

### Utilities
- **QR Code Generation**: `qrcode.react`

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
    Create a `.env.local` file at the root to hold your mail credentials:
    ```
    SMTP_USER=your-email@gmail.com
    SMTP_PASS=your-app-password
    # SMTP_HOST=smtp.gmail.com
    # SMTP_PORT=587
    ```
    *(If no ENV is supplied, the app will safely run in DEV MODE and print OTPs via browser alerts)*

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

## License

This project is licensed under the MIT License.
