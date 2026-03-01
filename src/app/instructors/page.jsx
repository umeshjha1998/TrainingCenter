import OurInstructors from "../../screens/OurInstructors";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";

export const metadata = {
    title: "Instructors | AC & DC Tech Institute",
    description: "Meet the industry veterans and certified experts shaping the next generation of technical professionals.",
};

export default function InstructorsPage() {
    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-100 font-display antialiased selection:bg-primary/30 selection:text-primary min-h-screen flex flex-col">
            <Navbar />
            <OurInstructors />
            <Footer />
        </div>
    );
}
