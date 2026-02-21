import React, { useState, useEffect } from "react";
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, query, orderBy, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import GenerateCertificateModal from "../../components/admin/GenerateCertificateModal";
import ConfirmationModal from "../../components/admin/ConfirmationModal";

export default function ManageCertificates() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCert, setSelectedCert] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [certToDelete, setCertToDelete] = useState(null);
    const [certificates, setCertificates] = useState([]);
    const [students, setStudents] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedGroups, setExpandedGroups] = useState({});

    const toggleExpand = (certId) => {
        setExpandedGroups(prev => ({
            ...prev,
            [certId]: !prev[certId]
        }));
    };

    // Fetch students
    useEffect(() => {
        const q = query(collection(db, "users"), where("role", "==", "student"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setStudents(list);
        });
        return () => unsubscribe();
    }, []);

    // Fetch courses
    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "courses"), (snapshot) => {
            const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setCourses(list);
        });
        return () => unsubscribe();
    }, []);

    // Fetch certificates with real-time updates
    useEffect(() => {
        const q = query(collection(db, "certificates"), orderBy("date", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const certsList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setCertificates(certsList);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching certificates: ", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleGenerate = async (data) => {
        try {
            // Check for existing certificates for this student and course
            const q = query(
                collection(db, "certificates"),
                where("studentId", "==", data.studentId),
                where("courseId", "==", data.courseId)
            );
            const querySnapshot = await getDocs(q);
            const existingCount = querySnapshot.size;
            const version = existingCount + 1;

            const certData = {
                student: data.studentName,
                studentId: data.studentId, // Store ID
                course: data.courseName,
                courseId: data.courseId,   // Store ID
                instructorName: data.instructorName, // Store Instructor Name
                marks: data.marks,         // Store Marks
                date: new Date(data.issueDate).toLocaleString('en-US', { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }),
                isoDate: data.issueDate, // Store ISO date for sorting/input
                status: "Issued", // Default status
                version: version, // Store version
                updatedAt: new Date()
            };

            if (data.id) {
                // Update existing
                const certRef = doc(db, "certificates", data.id);
                // When updating, we might want to keep the original version or allow edit. 
                // For now, let's keep the existing version if it exists, or set to 1.
                // But wait, 'data' comes from the modal. If we are editing, we should probably Pass the version through.
                // The modal 'data' is constructed from inputs. 
                // If it's an edit, we should ideally preserve the version from the original record.
                // However, the current modal flow reconstructs dataToSave. 
                // Let's assume for editing we just update fields and keep version if passed, or fetch it?
                // Simpler: Just update the fields we changed. 'data' doesn't have version unless we put it there.
                // Let's NOT update version on Edit. Only on Create.

                // We need to be careful not to overwrite version with undefined if we don't pass it.
                // But certData here is a whole new object effectively replacing the old data merges?
                // updateDoc merges. So if we don't include version in certData, it stays?
                // BUT certData is creating a fresh object.
                // Let's just NOT set version in certData for update, unless we want to recalculate it (which we shouldn't).

                const { version, ...updateData } = certData; // Exclude version from update payload to preserve existing
                await updateDoc(certRef, updateData);
                alert("Certificate updated successfully!");
            } else {
                // Create new
                const currentYear = new Date().getFullYear();
                const prefix = `CERT-${currentYear}-`;

                // Find max sequence number for current year
                const maxSeq = certificates.reduce((max, cert) => {
                    if (cert.displayId && cert.displayId.startsWith(prefix)) {
                        const seq = parseInt(cert.displayId.split('-').pop(), 10);
                        return seq > max ? seq : max;
                    }
                    return max;
                }, 0);

                const displayId = `${prefix}${String(maxSeq + 1).padStart(4, '0')}`;

                await addDoc(collection(db, "certificates"), {
                    ...certData,
                    displayId: displayId, // Store readable ID
                    createdAt: new Date()
                });
                alert(`Certificate generated successfully! (Version ${version})`);
            }
        } catch (error) {
            console.error("Error saving certificate:", error);
            alert("Failed to save certificate.");
        }
    };

    const handleEdit = (cert) => {
        // Prepare data for modal (it expects issueDate as YYYY-MM-DD)
        // If we stored isoDate, we can use it.
        const preparedCert = {
            ...cert,
            student: cert.student,
            course: cert.course,
            date: cert.isoDate || cert.date || new Date().toISOString() // Fallback logic updated
        };
        setSelectedCert(preparedCert);
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setSelectedCert(null);
        setIsModalOpen(true);
    };

    const confirmDelete = (certId) => {
        setCertToDelete(certId);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteCertificate = async () => {
        if (!certToDelete) return;

        try {
            await deleteDoc(doc(db, "certificates", certToDelete));
            setIsDeleteModalOpen(false);
            setCertToDelete(null);
        } catch (error) {
            console.error("Error deleting certificate:", error);
            alert("Failed to delete certificate.");
        }
    };

    if (loading) {
        return <div className="text-center p-10">Loading certificates...</div>;
    }

    return (
        <div className="space-y-6">
            <GenerateCertificateModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onGenerate={handleGenerate}
                initialData={selectedCert}
            />
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                        Manage Generated Certificates
                    </h1>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        View, edit, and verify all issued training certificates.
                    </p>
                </div>
                <button
                    onClick={handleCreate}
                    className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-md hover:shadow-lg text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all active:scale-95">
                    <span className="material-icons text-base mr-2">add_circle</span>
                    Generate New Certificate
                </button>
            </div>

            <div className="bg-white dark:bg-slate-900 shadow-sm ring-1 ring-slate-900/5 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                        <thead className="bg-slate-50 dark:bg-slate-800/50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">
                                    Student Name
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">
                                    Course
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">
                                    Certificate ID
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">
                                    Date Issued
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">
                                    Status
                                </th>
                                <th scope="col" className="relative px-6 py-3">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-800">
                            {certificates.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-10 text-center text-slate-500 dark:text-slate-400">
                                        No certificates found. Generate one to get started.
                                    </td>
                                </tr>
                            ) : (
                                (() => {
                                    // Group certificates by Student + Course
                                    const groups = {};
                                    certificates.forEach(cert => {
                                        const key = `${cert.studentId}_${cert.courseId}`;
                                        if (!groups[key]) {
                                            groups[key] = [];
                                        }
                                        groups[key].push(cert);
                                    });

                                    // Sort versions within groups (descending) and convert to array
                                    const groupedList = Object.values(groups).map(group => {
                                        group.sort((a, b) => b.version - a.version); // Highest version first
                                        return group;
                                    });

                                    // Sort groups by the highest version's displayId (descending) to keep sequence
                                    groupedList.sort((a, b) => {
                                        const idA = a[0].displayId || "";
                                        const idB = b[0].displayId || "";
                                        // Extract sequence number for numeric sort
                                        const seqA = parseInt(idA.split('-').pop(), 10) || 0;
                                        const seqB = parseInt(idB.split('-').pop(), 10) || 0;
                                        return seqB - seqA;
                                    });

                                    return groupedList.map(group => {
                                        const latestCert = group[0];
                                        const history = group.slice(1);
                                        const hasHistory = history.length > 0;
                                        const isExpanded = expandedGroups[latestCert.id];

                                        const studentObj = students.find(s => s.id === latestCert.studentId);
                                        const courseObj = courses.find(c => c.id === latestCert.courseId);
                                        const displayStudentName = studentObj ? (studentObj.fullName || studentObj.name) : latestCert.student;
                                        const displayCourseName = courseObj ? courseObj.name : latestCert.course;

                                        const renderRow = (cert, isLatest, isHistoryRow = false) => (
                                            <tr key={cert.id} className={`${isHistoryRow ? "bg-slate-50/50 dark:bg-slate-800/30" : "hover:bg-slate-50 dark:hover:bg-slate-800/50"} transition-colors border-b dark:border-slate-800`}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        {isLatest && (
                                                            <div className="mr-3 w-6 flex justify-center">
                                                                {hasHistory && (
                                                                    <button
                                                                        onClick={() => toggleExpand(latestCert.id)}
                                                                        className="text-slate-400 hover:text-primary transition-colors focus:outline-none"
                                                                    >
                                                                        <span className="material-icons text-sm transform transition-transform duration-200" style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}>
                                                                            chevron_right
                                                                        </span>
                                                                    </button>
                                                                )}
                                                            </div>
                                                        )}
                                                        {isHistoryRow && <div className="w-9 mr-3"></div>} {/* Spacer for indentation */}

                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-10 w-10">
                                                                <div className={`h-10 w-10 rounded-full flex items-center justify-center text-slate-500 font-bold ${isHistoryRow ? "bg-slate-100 dark:bg-slate-800 scale-90" : "bg-slate-200 dark:bg-slate-700"}`}>
                                                                    {displayStudentName ? displayStudentName.charAt(0) : "?"}
                                                                </div>
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className={`font-medium ${isHistoryRow ? "text-slate-600 dark:text-slate-400 text-sm" : "text-slate-900 dark:text-white text-sm"}`}>
                                                                    {displayStudentName}
                                                                    {cert.version > 1 && <span className="ml-2 text-xs text-slate-400 font-normal border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5">v{cert.version}</span>}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-slate-900 dark:text-white">{displayCourseName}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono border border-slate-200 dark:border-slate-700">
                                                        {cert.displayId || cert.id.substring(0, 8).toUpperCase()}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                                                    {cert.date}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ring-1 ring-inset ${cert.status === 'Issued' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 ring-green-600/20' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 ring-yellow-600/20'}`}>
                                                        {cert.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex items-center justify-end space-x-2">
                                                        <button
                                                            className="text-slate-400 hover:text-primary transition-colors"
                                                            title="View"
                                                            onClick={() => window.open(`/c/${cert.displayId || cert.id}`, '_blank')}
                                                        >
                                                            <span className="material-icons text-xl">visibility</span>
                                                        </button>
                                                        <button
                                                            className="text-slate-400 hover:text-primary transition-colors"
                                                            title="Edit"
                                                            onClick={() => handleEdit(cert)}
                                                        >
                                                            <span className="material-icons text-xl">edit</span>
                                                        </button>
                                                        <button
                                                            className="text-slate-400 hover:text-red-500 transition-colors"
                                                            title="Delete"
                                                            onClick={() => confirmDelete(cert.id)}
                                                        >
                                                            <span className="material-icons text-xl">delete</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );

                                        return (
                                            <React.Fragment key={latestCert.id}>
                                                {renderRow(latestCert, true)}
                                                {isExpanded && history.map(cert => renderRow(cert, false, true))}
                                            </React.Fragment>
                                        );
                                    });
                                })()
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteCertificate}
                title="Delete Certificate"
                message="Are you sure you want to delete this certificate? This action cannot be undone."
                confirmText="Delete"
                isDanger={true}
            />
        </div>
    );
}
