# AC & DC Technical Institute Training Center

A comprehensive web platform for managing a technical training institute, featuring student enrollment, course management, detailed reporting, and a secure certificate verification system.

## Live Demo
- **Vercel**: [AC & DC Technical Institute Training Center](https://acdcinstitute.vercel.app/#/)
- **GitHub Pages**: [AC & DC Technical Institute Training Center](https://umeshjha1998.github.io/TrainingCenter)

## Features

### Public Portal
- **Home**: Landing page showcasing available courses, institute details, and contact information.
- **Login/Register**: Secure authentication for students and administrators.
- **Certificate Verification**: Publicly accessible verification system. Verify issued certificates using a unique Certificate ID or by scanning a QR code.

### Student Portal
- **Dashboard**: Overview of enrolled courses and profile.
- **My Courses**: Access course materials and progress.
    - **Dropout Functionality**: Students can drop courses they are no longer interested in, with a confirmation prompt.
- **Schedule**: View upcoming classes and events (Placeholder).
- **Support**: Contact support for assistance (Placeholder).

### Admin Portal
- **Dashboard**: High-level overview of total students, courses, and certificates issued.
- **Manage Students**: Full CRUD (Create, Read, Update, Delete) operations for student records.
- **Manage Courses**: Create, edit, and delete courses.
    - **Course Duration**: Added support for specifying course duration.
- **Manage Certificates**:
    - **Generation**: Generate new certificates for students. Select student/course, input marks for subjects, and set a custom issue date and time.
    - **Management**: View all issued certificates, revoke invalid ones.
    - **QR Code**: Automatic generation of QR codes for easy verification.
- **Reports**: Visual analytics and system reports.
    - **Charts**: View "Course Popularity" and other metrics using interactive charts.

## Technologies Used

### Frontend
- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Router**: [React Router v7](https://reactrouter.com/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Visualization**: [Recharts](https://recharts.org/) (for Admin Reports)

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

This project is configured for deployment on platforms like Vercel or GitHub Pages.

### Deploying to GitHub Pages
1.  Update `vite.config.js` with the correct base path (e.g., `/TrainingCenter/`).
2.  Run the build command:
    ```bash
    npm run build
    ```
3.  Deploy the `dist` folder to the `gh-pages` branch.

## License

This project is licensed under the MIT License.
