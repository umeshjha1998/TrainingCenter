import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { db } from "../../firebase";
import { doc, getDoc, collection, query, where, getDocs, addDoc, Timestamp, deleteDoc } from "firebase/firestore";

export default function StudentDashboard() {
    const { data: session } = useSession();
    const currentUser = session?.user;

    const [userData, setUserData] = useState(null);
    const [enrolledCoursesDetails, setEnrolledCoursesDetails] = useState([]);
    const [myCertificates, setMyCertificates] = useState([]);
    const [allCourses, setAllCourses] = useState([]);
    const [myRequests, setMyRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [requesting, setRequesting] = useState(false);

    useEffect(() => {
        if (!currentUser) return;

        let unsubUser = () => { };
        let unsubCerts = () => { };
        let unsubAllCourses = () => { };
        let unsubRequests = () => { };

        try {
            // 1. Fetch User Data (Real-time)
            const userDocRef = doc(db, "users", currentUser.uid);
            unsubUser = onSnapshot(userDocRef, async (userDocSnap) => {
                let enrolledIds = [];
                if (userDocSnap.exists()) {
                    const data = userDocSnap.data();
                    setUserData(data);

                    if (data.enrolledCourses && data.enrolledCourses.length > 0) {
                        enrolledIds = data.enrolledCourses.map(c => c.id);
                        // We still need to get course details for enrolled courses.
                        // We can do this once or set up individual listeners.
                        // For simplicity, we'll fetch them directly when enrolledCourses changes.
                        const coursesProms = data.enrolledCourses.map(async (c) => {
                            const courseRef = doc(db, "courses", c.id);
                            const courseSnap = await getDoc(courseRef);
                            if (courseSnap.exists()) {
                                return { id: c.id, ...courseSnap.data(), assignedAt: c.assignedAt };
                            }
                            return c;
                        });
                        const coursesResults = await Promise.all(coursesProms);
                        setEnrolledCoursesDetails(coursesResults);
                    } else {
                        setEnrolledCoursesDetails([]);
                    }
                }
            });

            // 2. Fetch Certificates (Real-time)
            const qCerts = query(collection(db, "certificates"), where("studentId", "==", currentUser.uid));
            unsubCerts = onSnapshot(qCerts, (certsSnap) => {
                const certsList = certsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
                setMyCertificates(certsList);
            });

            // 3. Fetch All Courses (Real-time)
            const qAllCourses = query(collection(db, "courses"));
            unsubAllCourses = onSnapshot(qAllCourses, (allCoursesSnap) => {
                const allCoursesList = allCoursesSnap.docs.map(d => ({ id: d.id, ...d.data() }));
                setAllCourses(allCoursesList);
            });

            // 4. Fetch My Enrollment Requests (Real-time)
            const qRequests = query(collection(db, "enrollmentRequests"), where("studentId", "==", currentUser.uid));
            unsubRequests = onSnapshot(qRequests, (requestsSnap) => {
                const requestsList = requestsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
                requestsList.sort((a, b) => {
                    const dateA = a.requestDate?.toDate ? a.requestDate.toDate() : new Date(a.requestDate || 0);
                    const dateB = b.requestDate?.toDate ? b.requestDate.toDate() : new Date(b.requestDate || 0);
                    return dateB - dateA;
                });
                setMyRequests(requestsList);
            });

        } catch (error) {
            console.error("Error setting up listeners:", error);
        } finally {
            setLoading(false);
        }

        return () => {
            unsubUser();
            unsubCerts();
            unsubAllCourses();
            unsubRequests();
        };
    }, [currentUser]);

    const calculateProgressPercentage = (assignedAt, durationStr) => {
        if (!assignedAt) return 0;

        let totalDays = 30; // fallback
        if (durationStr) {
            const str = durationStr.toLowerCase();
            const val = parseInt(str.match(/\d+/)?.[0] || '0');
            if (!isNaN(val) && val > 0) {
                if (str.includes('month')) totalDays = val * 30;
                else if (str.includes('week')) totalDays = val * 7;
                else if (str.includes('year')) totalDays = val * 365;
                else if (str.includes('day')) totalDays = val;
                else totalDays = val;
            }
        }

        const startDate = assignedAt.toDate ? assignedAt.toDate() : new Date(assignedAt);
        const currentDate = new Date();
        const diffTime = currentDate - startDate;
        let diffDays = diffTime / (1000 * 60 * 60 * 24);

        if (diffDays < 0) diffDays = 0;

        let progress = (diffDays / totalDays) * 100;
        if (progress > 100) progress = 100;
        return Math.round(progress);
    };

    const handleRequestEnrollment = async (course) => {
        if (!currentUser || requesting) return;

        // Ensure not already requested and pending/approved
        const existingReq = myRequests.find(r => r.courseId === course.id && (r.status === "pending" || r.status === "approved"));
        if (existingReq) {
            alert("You already have an active request for this course.");
            return;
        }

        setRequesting(true);
        try {
            const requestData = {
                studentId: currentUser.uid,
                studentName: userData?.fullName || currentUser.email,
                studentEmail: currentUser.email,
                courseId: course.id,
                courseName: course.name,
                status: "pending",
                requestDate: Timestamp.now(),
            };

            const docRef = await addDoc(collection(db, "enrollmentRequests"), requestData);

            // Add to local state to reflect immediately
            setMyRequests([{ id: docRef.id, ...requestData }, ...myRequests]);
            alert("Enrollment request submitted successfully! An admin will review it soon.");
        } catch (error) {
            console.error("Error submitting request:", error);
            alert("Failed to submit request.");
        } finally {
            setRequesting(false);
        }
    };

    const handleCancelRequest = async (requestId) => {
        if (!confirm("Are you sure you want to cancel this enrollment request?")) return;
        try {
            await deleteDoc(doc(db, "enrollmentRequests", requestId));
            setMyRequests(myRequests.filter(req => req.id !== requestId));
            alert("Request cancelled successfully.");
        } catch (error) {
            console.error("Error cancelling request:", error);
            alert("Failed to cancel request.");
        }
    };

    // Filter available courses to those not in pending requests and not already enrolled
    const enrolledCourseIds = enrolledCoursesDetails.map(c => c.id);
    const pendingCourseIds = myRequests.filter(r => r.status === "pending" || r.status === "approved").map(r => r.courseId);
    const availableToRequest = allCourses;

    if (loading) return (
        <div className="flex justify-center items-center py-20 min-h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    );

    return (
        <div>
            {/* Header / Welcome */}
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard Overview</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Welcome back, {userData?.fullName || currentUser?.email}. Here's your learning progress.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column: Enrolled Courses & Available Courses */}
                <div className="lg:col-span-8 space-y-6">
                    {/* Enrolled Courses */}
                    {enrolledCoursesDetails.length > 0 ? (
                        enrolledCoursesDetails.map(course => {
                            const courseCerts = myCertificates.filter(c => c.courseId === course.id || c.course === course.name);
                            const relatedCert = courseCerts.sort((a, b) => {
                                const vDiff = (b.version || 1) - (a.version || 1);
                                if (vDiff !== 0) return vDiff;
                                return new Date(b.isoDate || b.date || 0) - new Date(a.isoDate || a.date || 0);
                            })[0];
                            const progress = calculateProgressPercentage(course.assignedAt, course.duration);

                            return (
                                <div key={course.id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm relative group">
                                    <div className="absolute inset-0 pointer-events-none opacity-5" style={{ backgroundImage: "radial-gradient(#13ec5b 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>
                                    <div className="p-6 md:p-8 relative z-10 flex flex-col md:flex-row gap-6 md:items-center">
                                        <div className="w-full md:w-1/3 aspect-video md:aspect-[4/3] rounded-lg overflow-hidden relative shadow-lg bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                                            {course.image ? (
                                                <img src={course.image} alt={course.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                            ) : (
                                                <span className="material-icons text-6xl text-slate-400 notranslate" translate="no">school</span>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                                            <span className="absolute bottom-3 left-3 bg-primary text-black text-xs font-bold px-2 py-1 rounded">
                                                {progress >= 100 ? "COMPLETED" : "IN PROGRESS"}
                                            </span>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{course.name}</h3>
                                            <div className="grid grid-cols-2 gap-4 mb-6">
                                                <div className="flex items-center gap-2">
                                                    <span className="material-icons text-slate-400 text-lg notranslate" translate="no">schedule</span>
                                                    <div className="flex flex-col">
                                                        <span className="text-xs text-slate-500 dark:text-slate-400">Duration</span>
                                                        <span className="text-sm font-medium dark:text-white">{course.duration || "N/A"}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="material-icons text-slate-400 text-lg notranslate" translate="no">person</span>
                                                    <div className="flex flex-col">
                                                        <span className="text-xs text-slate-500 dark:text-slate-400">Instructor</span>
                                                        <span className="text-sm font-medium dark:text-white">{course.instructor || "Not Assigned"}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <button className="flex-1 bg-primary hover:bg-primary-dark text-black font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2">
                                                    <span>Continue Learning</span>
                                                    <span className="material-icons text-lg notranslate" translate="no">arrow_forward</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Subjects Progress List */}
                                    {course.subjects && course.subjects.length > 0 && (
                                        <div className="bg-slate-50 dark:bg-slate-800/50 p-6 md:p-8 m-4 rounded-lg border border-slate-200 dark:border-slate-800">
                                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                                <span className="material-icons text-primary notranslate" translate="no">playlist_add_check</span>
                                                Subject Progress
                                            </h3>
                                            <div className="space-y-4">
                                                {course.subjects.map((sub, idx) => {
                                                    const subjectName = typeof sub === 'string' ? sub : sub.name;
                                                    const subjectMarks = relatedCert?.marks?.[subjectName];

                                                    let subProgress = 0;
                                                    let subStatusText = "Pending";

                                                    if (subjectMarks && subjectMarks.obtained !== "") {
                                                        subProgress = Math.min(100, Math.max(0, (parseFloat(subjectMarks.obtained) / parseFloat(subjectMarks.total)) * 100));
                                                        subStatusText = `${subjectMarks.obtained} / ${subjectMarks.total}`;
                                                    }

                                                    return (
                                                        <div key={idx} className="group">
                                                            <div className="flex justify-between items-end mb-2">
                                                                <div>
                                                                    <h4 className="font-semibold text-slate-800 dark:text-slate-200">{subjectName}</h4>
                                                                    <span className="text-xs text-slate-500 dark:text-slate-400">{subStatusText}</span>
                                                                </div>
                                                                <span className="text-sm font-bold text-primary">{Math.round(subProgress)}%</span>
                                                            </div>
                                                            <div className="w-full bg-slate-200 dark:bg-slate-700/50 rounded-full h-2.5 overflow-hidden">
                                                                <div className="bg-primary h-2.5 rounded-full transition-all duration-1000 group-hover:bg-primary-dark" style={{ width: `${subProgress}%` }}></div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {/* Overall Progress */}
                                    <div className="h-1 w-full bg-slate-200 dark:bg-slate-800">
                                        <div className="h-full bg-primary" style={{ width: `${progress}%` }}></div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                            <span className="material-icons text-4xl text-slate-300 dark:text-slate-600 mb-2 notranslate" translate="no">school</span>
                            <p className="text-slate-500 dark:text-slate-400">You are not enrolled in any courses yet.</p>
                        </div>
                    )}

                    {/* Available Courses for Enrollment */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <span className="material-icons text-primary notranslate" translate="no">school</span>
                                Available for Enrollment
                            </h3>
                            <span className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded border border-primary/20">Expand Skills</span>
                        </div>

                        {availableToRequest.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {availableToRequest.map(course => {
                                    const isEnrolled = enrolledCourseIds.includes(course.id);
                                    const pendingReq = myRequests.find(r => r.courseId === course.id && r.status === "pending");
                                    const isApproved = myRequests.find(r => r.courseId === course.id && r.status === "approved");

                                    let btnText = "Request Enrollment";
                                    let btnDisabled = requesting;
                                    let btnClass = "w-full py-2 px-3 bg-transparent border border-primary text-primary hover:bg-primary hover:text-black font-semibold rounded text-sm transition-colors flex items-center justify-center gap-2 group disabled:opacity-50";

                                    if (isEnrolled || isApproved) {
                                        btnText = "Enrolled";
                                        btnDisabled = true;
                                        btnClass = "w-full py-2 px-3 bg-green-500/10 border border-green-500/30 text-green-700 dark:text-green-400 font-semibold rounded text-sm flex items-center justify-center gap-2 opacity-70 cursor-not-allowed";
                                    } else if (pendingReq) {
                                        btnText = "Requested (Pending)";
                                        btnDisabled = true;
                                        btnClass = "w-full py-2 px-3 bg-yellow-500/10 border border-yellow-500/30 text-yellow-700 dark:text-yellow-400 font-semibold rounded text-sm flex items-center justify-center gap-2 opacity-70 cursor-not-allowed";
                                    }

                                    return (
                                        <div key={course.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 bg-slate-50 dark:bg-slate-800/50 flex flex-col justify-between hover:border-primary/50 transition-colors">
                                            <div className="mb-4">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h4 className="font-bold text-slate-900 dark:text-white line-clamp-1" title={course.name}>{course.name}</h4>
                                                </div>
                                                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                                                    {course.description || "Learn new skills with this course."}
                                                </p>
                                                <div className="mt-3 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                                                    <span className="flex items-center gap-1"><span className="material-icons text-[14px] notranslate" translate="no">schedule</span> {course.duration || "N/A"}</span>
                                                    <span className="flex items-center gap-1"><span className="material-icons text-[14px] notranslate" translate="no">person</span> {course.instructor || "TBD"}</span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleRequestEnrollment(course)}
                                                disabled={btnDisabled}
                                                className={btnClass}
                                            >
                                                <span>{requesting && !btnDisabled ? "Requesting..." : btnText}</span>
                                                {!btnDisabled && <span className="material-icons text-base group-hover:ml-1 transition-all notranslate" translate="no">send</span>}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-sm text-slate-500 text-center py-4">No new courses available right now.</p>
                        )}
                    </div>
                </div>

                {/* Right Column: Requests & Certificates */}
                <div className="lg:col-span-4 space-y-6">
                    {/* My Requests (Enrollment) */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                            <span className="material-icons text-primary notranslate" translate="no">assignment</span>
                            My Requests
                        </h3>
                        <div className="space-y-4">
                            {myRequests.length > 0 ? (
                                myRequests.slice(0, 5).map(req => {
                                    const dateStr = req.requestDate?.toDate ? req.requestDate.toDate().toLocaleDateString() : 'Unknown';
                                    let statusBg = "", statusTextCol = "", statusBorder = "";
                                    let statusText = req.status.toUpperCase();

                                    if (req.status === "pending") {
                                        statusBg = "bg-yellow-500/5"; statusTextCol = "text-yellow-600 dark:text-yellow-400"; statusBorder = "border-yellow-500/20";
                                    } else if (req.status === "approved") {
                                        statusBg = "bg-primary/5"; statusTextCol = "text-primary-dark dark:text-primary"; statusBorder = "border-primary/20";
                                    } else {
                                        statusBg = "bg-red-500/5"; statusTextCol = "text-red-600 dark:text-red-400"; statusBorder = "border-red-500/20";
                                    }

                                    return (
                                        <div key={req.id} className={`flex items-center justify-between p-3 rounded-lg border ${statusBorder} ${statusBg}`}>
                                            <div className={req.status === "denied" ? "opacity-75" : ""}>
                                                <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[150px]" title={req.courseName}>
                                                    {req.courseName}
                                                </h4>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">Submitted: {dateStr}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${statusTextCol}`}>
                                                    {statusText}
                                                </span>
                                                {req.status === "pending" && (
                                                    <button
                                                        onClick={() => handleCancelRequest(req.id)}
                                                        className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded p-1"
                                                        title="Cancel Request"
                                                    >
                                                        <span className="material-icons text-sm notranslate" translate="no">close</span>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="text-sm text-slate-500 italic">No enrollment requests yet.</p>
                            )}
                        </div>
                    </div>

                    {/* My Certificates */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                            <span className="material-icons text-primary notranslate" translate="no">workspace_premium</span>
                            My Certificates
                        </h3>
                        <div className="space-y-4">
                            {myCertificates.length > 0 ? (
                                myCertificates.map(cert => (
                                    <div key={cert.id} className="flex items-center gap-4 p-3 rounded-lg border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors">
                                        <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                                            <span className="material-icons notranslate" translate="no">description</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                                                {cert.course}
                                            </h4>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                Issued: {cert.date}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => window.open(`/c/${cert.displayId || cert.id}`, '_blank')}
                                            className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-slate-900 hover:scale-110 transition-transform shadow-md shadow-primary/20"
                                            title="View Certificate">
                                            <span className="material-icons text-sm notranslate" translate="no">visibility</span>
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-slate-500 italic">No certificates issued yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
