# UI/UX & Design Guidelines

The AC & DC Technical Institute application maintains a modern, accessible, and intuitive interface powered primarily by Tailwind CSS v4 and Next.js. Any new pages or features built by agents should mirror these existing design patterns.

## 1. Color Palette & Typography
- The application uses a dynamic, modern color scheme (typically with sleek dark modes or contrasting branding matching an institutional tone). Avoid generic "red", "green", "blue" unless they are semantic aliases like `bg-red-500` for delete buttons.
- Intersect brand guidelines and fallback to system fonts if necessary.

## 2. Component Design & Reusability
- Keep components modular. If building a new feature like 'Reports', wrap its structural parts into semantic React components (`src/components/...`).
- **Modals**: Heavy reliance on custom Modal components (e.g., `RegisterStudentModal`, `AssignCourseModal`, `GenerateCertificateModal`) to perform CRUD without unnecessary routing overhead.
- **Buttons / Forms**: Utilize hover, focus, and disabled states.

## 3. Student Progress & Visuals
- Enrolled courses on the student dashboard dynamically display max marks and obtained marks visually.
- The progression bar uses specific duration calculations to map progression. New mathematical calculations or chart renders should rely on **Recharts**. Example: `Course Popularity (Top 5)` charts.

## 4. Mobile Responsiveness
- All views must scale from dense desktop administration tables to vertically stacked, tappable mobile layouts. Use standard breakpoints (`sm:`, `md:`, `lg:`).

## 5. File System References
Ensure all images are adequately referred to in `public/` and linked via root-relative paths like `/images/...` to prevent broken links during GitHub/Vercel routing differences.

## 6. Certificates & Print Aesthetics
- Generated Certificates use QR codes via `qrcode.react`. These are intentionally scaled up (e.g., multiplier of 5) for better camera scanning functionality.
- Include a specific, clear aesthetic hierarchy for the Student Name, Dynamic Subjects mapped out by score, Issue Dates, and digital signature approximations.

## 7. Icons and Internationalization
- When utilizing `material-icons`, you **MUST** attach `class="notranslate"` and `translate="no"` to the icon element (e.g., `<span className="material-icons notranslate" translate="no">home</span>`).
- Failure to do this will cause the text ligature (e.g., "home") to be translated into another language by Google Translate, breaking the visual icon rendering.

---
*Note: Ensure to update these design guidelines if introducing new component libraries or changing the fundamental themes.*
