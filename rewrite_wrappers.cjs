const fs = require('fs');

const files = {
    'src/app/admin/page.jsx': `"use client";\nimport AdminDashboard from "../../pages/admin/AdminDashboard";\nexport default function Page() { return <AdminDashboard />; }`,
    'src/app/admin/students/page.jsx': `"use client";\nimport ManageStudents from "../../../pages/admin/ManageStudents";\nexport default function Page() { return <ManageStudents />; }`,
    'src/app/admin/courses/page.jsx': `"use client";\nimport ManageCourses from "../../../pages/admin/ManageCourses";\nexport default function Page() { return <ManageCourses />; }`,
    'src/app/admin/certificates/page.jsx': `"use client";\nimport ManageCertificates from "../../../pages/admin/ManageCertificates";\nexport default function Page() { return <ManageCertificates />; }`,
    'src/app/admin/reports/page.jsx': `"use client";\nimport SystemReports from "../../../pages/admin/Reports";\nexport default function Page() { return <SystemReports />; }`,
    'src/app/student-dashboard/page.jsx': `"use client";\nimport StudentDashboard from "../../pages/student/StudentDashboard";\nexport default function Page() { return <StudentDashboard />; }`,
};

for (const [file, content] of Object.entries(files)) {
    fs.writeFileSync(file, content);
}
console.log("Rewrote dashboard wrappers with correct src/pages paths.");
