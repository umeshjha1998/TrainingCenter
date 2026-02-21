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
- **Verification Page**: Accessible via `<URL>/verify/<$certificateId>`. Can also be accessed by scanning the dynamically generated `qrcode.react` tag on the certificate itself which includes a direct HTTP link.

## 3. Global Search Protocol
On the dashboard, predictive querying resolves searches against the User (Email/Name), Course (Title), and Certificates (IDs). Ensure search performance by maintaining lightweight indexing structures. Keep logic centralized in a utility/service if expanded.

## 4. Student Enrollment & Dropouts
Students can self-manage certain aspects of their enrollment.
### Workflow:
- Admins typically assign courses via `Assign Course Modal`, tying the course details and default metadata.
- A student logs into their portal and sees the new assignment.
- To `Dropout`, they choose to forfeit the course via the button that prompts a `Window Verification/Confirmation Dialog`. Deletion reflects back synchronously in Firestore and updates the visual DOM state without full page refreshes.

## 5. Internationalization (i18n)
The application handles multi-language support (English, Hindi, Bhojpuri, Maithili) via a custom wrapper around the Google Translate widget (`GoogleTranslate.jsx`).
### Workflow:
- A user changes the language via the globe icon in the Navbar.
- The custom UI dropdown triggers a change event on the hidden `.goog-te-combo` select element, forcing Google Translate to re-render text nodes without requiring a page reload.
- The user's selection sets a `googtrans` cookie, which is respected across page navigation.

---
*Note: Any new feature requests must be reflected in this file by updating their workflow definition.*
