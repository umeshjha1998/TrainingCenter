import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, PieChart, Pie, Cell } from "recharts";
import useDashboardStats from "../../hooks/useDashboardStats";

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export default function Reports() {
    const { enrollmentData, courseData, certificateData, loading } = useDashboardStats();

    if (loading) {
        return <div className="p-10 text-center text-slate-500">Loading reports...</div>;
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold leading-7 text-slate-900 dark:text-white sm:truncate sm:tracking-tight">
                    System Reports
                </h1>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Analyze institute performance, student attendance, and course popularity.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Enrollment Growth */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Enrollment Growth</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                                data={enrollmentData}
                                margin={{
                                    top: 10,
                                    right: 30,
                                    left: 0,
                                    bottom: 0,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                    itemStyle={{ color: '#1e293b' }}
                                />
                                <Area type="monotone" dataKey="students" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.1} strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Course Performance */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Course Popularity (Top 5)</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={courseData}
                                layout="vertical"
                                margin={{
                                    top: 5,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={true} vertical={false} />
                                <XAxis type="number" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis dataKey="name" type="category" width={100} stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                    cursor={{ fill: 'transparent' }}
                                />
                                <Bar dataKey="count" fill="#10B981" radius={[0, 4, 4, 0]} barSize={20} name="Students Enrolled" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Certificate Issuance Status */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Certificate Status</h3>
                    <div className="h-64 w-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={certificateData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {certificateData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Key Metrics Summary */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Key Metrics</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                            <p className="text-sm text-slate-500 dark:text-slate-400">Avg. Students per Course</p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                                {courseData.length > 0 ? (courseData.reduce((acc, curr) => acc + curr.count, 0) / courseData.length).toFixed(1) : 0}
                            </p>
                        </div>
                        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                            <p className="text-sm text-slate-500 dark:text-slate-400">Total Certifications</p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                                {certificateData.reduce((acc, curr) => acc + curr.value, 0)}
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
