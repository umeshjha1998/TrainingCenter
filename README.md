# AC & DC Technical Institute Training Center

A comprehensive web platform for managing a technical training institute, featuring student enrollment, course management, and a secure certificate verification system.

## Live Demo
Check out the live application here: [AC & DC Technical Institute Training Center](https://acdcinstitute.vercel.app/#/)

## Features

### Public Portal
- **Home**: Landing page showcasing available courses and institute details.
- **Login/Register**: Secure authentication for students and administrators.
- **Certificate Verification**: Anyone can verify issued certificates using a unique Certificate ID or by scanning a QR code.

### Student Portal
- **Dashboard**: Overview of enrolled courses and profile.
- **My Courses**: Access course materials and progress.
- **Schedule**: View upcoming classes and events (Placeholder).
- **Support**: Contact support for assistance (Placeholder).

### Admin Portal
- **Dashboard**: High-level overview of total students, courses, and certificates issued.
- **Manage Students**: Full CRUD operations for student records.
- **Manage Courses**: Create, edit, and delete courses.
- **Manage Certificates**: Generate new certificates, view issued certificates, and revoke certificates if necessary. include QR code generation.
- **Reports**: View system reports and analytics.

## Technologies Used

### Frontend
- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Router**: [React Router v7](https://reactrouter.com/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)

### Backend & Services
- **Backend-as-a-Service**: [Firebase](https://firebase.google.com/)
  - **Authentication**: Secure user login/registration.
  - **Firestore Database**: Real-time database for storing users, courses, and certificates.

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

3.  **Configure Firebase:**
    - Create a new project in the [Firebase Console](https://console.firebase.google.com/).
    - Enable **Authentication** (Email/Password).
    - Enable **Firestore Database** (Start in Test Mode).
    - Register a web app in your Firebase project and copy the configuration object.
    - Ideally, create a `.env` file in the root directory and update `src/firebase.js` to use environment variables.
    - Update `src/firebase.js` with your configuration keys:
    ```javascript
    const firebaseConfig = {
      apiKey: "YOUR_API_KEY",
      authDomain: "YOUR_AUTH_DOMAIN",
      projectId: "YOUR_PROJECT_ID",
      storageBucket: "YOUR_STORAGE_BUCKET",
      messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
      appId: "YOUR_APP_ID"
    };
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  **Open in browser:**
    Open [http://localhost:5173](http://localhost:5173) to view the application.

## Deployment

This project is configured for deployment on platforms like Vercel or Netlify.
The live demo is hosted on Vercel.

## License

This project is licensed under the MIT License.
