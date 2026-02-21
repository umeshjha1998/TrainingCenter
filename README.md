# AC & DC Technical Institute Training Center

A comprehensive web platform for managing a technical training institute, featuring student enrollment, course management, detailed reporting, and a secure certificate verification system.

## Live Demo
- **Vercel**: [AC & DC Technical Institute Training Center](https://acdcinstitute.vercel.app/#/)
- **GitHub Pages**: [AC & DC Technical Institute Training Center](https://umeshjha1998.github.io/TrainingCenter)

## Features

### Public Portal
- **Home**: Landing page showcasing available courses, institute details, and contact information.
- **Login/Register**: Secure authentication for students and administrators, protected by real-time OTP verification.
- **Certificate Verification**: Publicly accessible verification system. Verify issued certificates using a unique Certificate ID or by scanning a QR code.
- **Social Sharing**: One-click sharing of certificates to Email, Facebook, X (Twitter), Reddit, and WhatsApp.

### Student Portal
- **Dashboard**: High-level overview of profile and enrollment progress.
    - **Progress Tracking**: Dynamic progress bars visualizing course completion based on enrollment date and active duration.
- **My Courses**: Access course materials and progress.
    - **Dropout Functionality**: Students can drop courses they are no longer interested in, with a confirmation prompt.
- **Schedule**: View upcoming classes and events (Placeholder).
- **Support**: Contact support for assistance (Placeholder).

### Admin Portal
- **Global Search**: Unified predictive search bar enabling quick navigation to specific Students, Courses, or Certificates from anywhere in the dashboard.
- **Dashboard**: High-level overview of total students, courses, and certificates issued.
- **Manage Students**: Full CRUD (Create, Read, Update, Delete) operations for student records integrated with OTP security for email modifications.
- **Manage Courses**: Create, edit, and delete courses.
    - **Course Duration**: Added support for specifying course duration to feed progress algorithms.
- **Manage Certificates**:
    - **Generation**: Generate new certificates for students. Select student/course, input marks for subjects, and set a custom issue date and time.
    - **Management**: View all issued certificates, update existing records, revoke invalid ones.
    - **QR Code**: Automatic generation of QR codes for easy physical verification.
- **Reports**: Visual analytics and system reports.
    - **Charts**: View "Course Popularity" and other metrics using interactive charts.

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
