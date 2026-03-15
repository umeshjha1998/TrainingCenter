import PrivateRoute from "../../components/common/PrivateRoute";
import AdminLayout from "../../components/admin/AdminLayout";

export const metadata = {
    title: "Admin Dashboard | A.C. & D.C. Technical Institute",
};

export default function Layout({ children }) {
    return (
        <PrivateRoute adminOnly>
            <AdminLayout>{children}</AdminLayout>
        </PrivateRoute>
    );
}
