import PrivateRoute from "../../components/common/PrivateRoute";
import StudentLayout from "../../components/student/StudentLayout";

export const metadata = {
    title: "Student Dashboard | A.C. & D.C. Technical Institute",
};

export default function Layout({ children }) {
    return (
        <PrivateRoute>
            <StudentLayout>{children}</StudentLayout>
        </PrivateRoute>
    );
}
