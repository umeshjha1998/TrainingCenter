# Data Models & Schemas

The application leverages Firebase Firestore as its primary NoSQL database. There are three core entities representing a standard training institute flow: **Users**, **Courses**, and **Certificates**.

## 1. Users (Collection: `users` or `students`)
These are the primary entities managed by Admins and mapped out to Student/Admin portal views.
- **`uid`** (String): Firebase Auth ID for the user.
- **`role`** (String): Distinguishes the user type, e.g., 'student', 'admin'.
- **`email`** (String): Registered email. Modified via OTP-based confirmation.
- **`displayName`** (String): User's full name.
- **`enrolledCourses`** (Array of Objects): A list of objects referencing Course IDs and marking the enrollment status or dynamic progress.
  - **Structure detail**: Often includes `courseId`, `status`, and progress metrics.
  - **Dropout Feature**: Students can remove courses from this list via a `Dropout` function in their portal.

## 2. Courses (Collection: `courses`)
Courses form the syllabus available to students. Admins define the attributes.
- **`courseId`** (String/Auto-generated): Unique identifier for the course.
- **`title`** (String): Full name of the course.
- **`description`** (String/Text): The details of the course.
- **`duration`** (String/Number): The estimated time required to complete the course (used in Student progress bars).
- **`image`** (String): URL linking to an image stored either locally or on Firebase Storage.
- **`subjects`** (Array of Strings/Objects): The nested syllabus units comprising the course. Essential for generating certificates since marks are assigned per subject.

## 3. Certificates (Collection: `certificates`)
Certificates document successful completion of a course for a student.
- **`certificateId`** (String): Unique alphanumeric string suitable for Public Verification.
- **`studentId`** (String/Ref): Mapping to the student who earned the certificate.
- **`courseId`** (String/Ref): Mapping to the completed course.
- **`issueDate`** (Timestamp/String): Complete timestamp representing when the admin triggered generation. Modifiable by admins.
- **`marks`** (Object/Map): Key-value pair matching subject names to numeric scores earned by the student.
- **`qrCodeData`** (String): Generated data payload linking the physical QR code directly back to the public `/verify` page with `certificateId`.

## Operations Note
Agents implementing new features referencing these collections must observe these implicit relationships, maintaining synchronous updates when a course or student goes missing/is deleted.

---
*Note: If the user changes data fields or relationships, update this model schema representation accordingly.*
