# Application Sub-systems & Workflows

Ensure rigorous testing for all modifications to these sub-systems, as they represent the fundamental value proposition of the platform.

## 1. Real-time Authentication & OTP Verification
All new unverified accounts and unverified email modification requests are channeled through our custom NodeMailer API router (e.g., `/api/send-otp`).
### Workflow:
- A user/admin triggers an email change or registrations.
- Fetch random 6-digit OTP -> send through SMTP -> store in session/local state dynamically.
- Present a modal allowing 60 seconds of validity.
- Fallback constraint for development environment without ENV vars: present the OTP directly via `window.alert()` to prevent lock-outs.

## 2. Certificate Generation & Verification Engine
The `Generate Certificate` engine relies heavily on accurate matching.
### Workflow:
- Admin selects a student and a valid, enrolled, and uncertified course.
- Dynamic input fields spawn for each subject in the selected course to accept quantitative marks. It is prohibited for marks entered in subject X to leak into subject Y.
- Submit final metrics to Firestore under a unique `$certificateId`. 
- **Verification Page & Public Certificate**: Accessible via `/c/<$certificateId>`. This view renders the `CertificateTemplate` (aligned with Stitch UI), dynamically displaying subject-wise marks in a detailed table format (Max Marks, Obtained, Grade) along with official seals.
- The certificate can also be verified by scanning the dynamically generated `qrcode.react` tag on the certificate itself, which includes a direct HTTP link to the public certificate view.

## 3. Global Search Protocol
On the dashboard, predictive querying resolves searches against the User (Email/Name), Course (Title), and Certificates (IDs). Ensure search performance by maintaining lightweight indexing structures. Keep logic centralized in a utility/service if expanded.

## 4. Student Enrollment & Dropouts
Students can self-manage certain aspects of their enrollment.
### Workflow:
- Admins typically assign courses via `Assign Course Modal`, tying the course details and default metadata.
- A student logs into their portal and sees the new assignment. These assignments propagate to the Student Dashboard instantly via Firebase `onSnapshot` real-time listeners, ensuring the student sees the updated Enrolled courses and Available courses immediately.
- To `Dropout`, they choose to forfeit the course via the button that prompts a `Window Verification/Confirmation Dialog`. Deletion reflects back synchronously in Firestore and updates the visual DOM state without full page refreshes.

## 5. Internationalization (i18n)
The application handles multi-language support (English, Hindi, Bhojpuri, Maithili) via a custom wrapper around the Google Translate widget (`GoogleTranslate.jsx`).
### Workflow:
- A user changes the language via the globe icon in the Navbar.
- The custom UI dropdown triggers a change event on the hidden `.goog-te-combo` select element, forcing Google Translate to re-render text nodes without requiring a page reload.
- The user's selection sets a `googtrans` cookie, which is respected across page navigation.

## 6. Real-time Dashboards (Student & Admin)
Both the Student and Admin dashboards rely heavily on Firebase `onSnapshot` real-time listeners instead of one-time fetches.
### Workflow:
- When a user logs in, listeners attach to their `users` document, `certificates`, `courses`, and `enrollmentRequests`.
- Any backend change (like an admin approving a request or a new certificate being issued) immediately reflects on the UI without requiring a page refresh.
- Admin dashboards also display a real-time "Recent Activity" feed summarizing these events.
- **Student Dashboard Features**:
  - **Profile Overview**: Displays a read-only real-time reflection of the student's demographic and registration details (Aadhar, PAN, Passport, Photo) directly from their user document.
  - Displays a dynamically updating progress bar for each enrolled course based on `assignedAt` date and `duration`.
  - Shows an "Upcoming Exams" section for enrolled courses, dynamically presenting the `nextExam` dates assigned by admins.

## 7. Our Faculty Instructors
The platform maintains a public directory of instructors and their assigned courses.
### Workflow:
- Admins manage instructors via the Admin Dashboard (CRUD operations).
- **Image Management**: During creation or update, admins can upload a professional headshot.
    - **Validation**: Strict client-side check for 500KB file size limit.
    - **Storage**: Photos are converted to Base64 strings and saved directly to the instructor document in Firestore.
    - **Instruction UI**: Admins see clear guidelines on photo requirements (professional, clear, high-quality) and technical limits (500KB, JPG/PNG).
- During creation/update, admins can directly assign existing courses to these instructors.
- The public `OurInstructors` page fetches this data and provides filtering by department and text search. Images are displayed prominently in the directory.

## 8. Bulk Certificate Generation
Administrators can issue certificates to multiple students simultaneously.
### Workflow:
- Admin selects a course and can manually define marks for each subject within that course for each selected student via the UI, or upload an Excel/CSV file containing student emails.
- The system matches emails to registered users, verifies course enrollment, and calculates total scores.
- Validated entries are then processed in bulk, generating unique certificate IDs and recording subject-specific marks in Firestore.

## 9. Course Enrollment Requests
Students can request enrollment in courses they are not currently enrolled in.
### Workflow:
- Students browse all available courses on their dashboard (excluding already enrolled).
- Clicking "Request Enrollment" creates a pending request in Firestore.
- Students can interactively cancel their requests while they are still in a "pending" status.
- Admins view these requests in the Admin Dashboard and can "Approve" (assigns the course to the student and changes status to approved) or "Deny" them.
- Real-time listeners update both dashboards instantly.

## 10. Dark Mode
The website supports a creative toggle to enable and disable dark mode across all pages and components.
### Workflow:
- A user clicks the dark mode toggle switch (typically in the Navbar).
- A global state or context updates the theme to `dark`.
- Tailwind's dark mode classes are applied consistently across all UI elements.

## 11. Auto-Emailing Certificates
When a certificate is generated for a student, it should be automatically shared to the student via email.
### Workflow:
- Certificate generation is triggered (single or bulk).
- Upon successful generation and Firestore storage, the system retrieves the student's email.
- An email is dispatched using NodeMailer containing a secure link to view/download the certificate, or a copy of the certificate itself.

## 12. Theme Compatibility & Contrast Standards
To ensure accessibility and visibility across both light and dark modes, all UI components must adhere to the project's semantic color system.
### Guidelines:
- **Primary Buttons/Badges**: Use `bg-primary` with `text-primary-foreground`. Avoid hardcoding `text-white` or `text-black` on primary backgrounds, as the `primary` color's brightness shifts between themes.
- **Dynamic Contrast**: In Day Mode, `primary` is typically dark (requiring light text), while in Dark Mode, `primary` is typically light (requiring dark text). The `text-primary-foreground` utility handles this automatically.
- **Icon Visibility**: Material Icons should use `text-primary-foreground` when placed inside primary-colored containers to maintain legibility.

## 13. Student Registration & Manage Students
Students register through the public signup page, and administrators can register or edit students via the Admin Dashboard.
### Workflow:
- **Mandatory Photo Upload**: All new student registrations (via public signup or admin creation) require a profile photo. The system enforces a maximum file size of 500KB (JPG/PNG).
- **Storage**: Photos are converted to Base64 strings and linked to the `profilePhotoUrl` field directly inside the user document in Firestore.
- **Administrative Parity**: The admin's `RegisterStudentModal` provides full parity with public registration fields, including inputs for Aadhar, PAN, and Passport numbers, ensuring complete records can be managed internally.

---
*Note: Any new feature requests must be reflected in this file by updating their workflow definition.*
