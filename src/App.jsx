import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import PrivateRoute from "./components/common/PrivateRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageStudents from "./pages/admin/ManageStudents";
import ManageCourses from "./pages/admin/ManageCourses";
import ManageCertificates from "./pages/admin/ManageCertificates";
import Reports from "./pages/admin/Reports";
import StudentLayout from "./components/student/StudentLayout";
import StudentDashboard from "./pages/student/StudentDashboard";
import PublicCertificate from "./pages/public/PublicCertificate";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/c/:id" element={<PublicCertificate />} />

          <Route path="/admin" element={
            <PrivateRoute adminOnly={true}>
              <AdminLayout />
            </PrivateRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="students" element={<ManageStudents />} />
            <Route path="courses" element={<ManageCourses />} />
            <Route path="certificates" element={<ManageCertificates />} />
            <Route path="reports" element={<Reports />} />
          </Route>

          <Route path="/student-dashboard" element={
            <PrivateRoute>
              <StudentLayout />
            </PrivateRoute>
          }>
            <Route index element={<StudentDashboard />} />
            <Route path="courses" element={<div className="p-8">Courses Placeholder</div>} />
            <Route path="schedule" element={<div className="p-8">Schedule Placeholder</div>} />
            <Route path="support" element={<div className="p-8">Support Placeholder</div>} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
