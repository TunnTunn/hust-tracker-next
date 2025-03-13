"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import withAuth from "../hooks/withAuth";
import Link from "next/link";
import { getCurrentSemester } from "../utils/semester";
import { useLanguage } from "../contexts/LanguageContext";

const Home = () => {
    const { t } = useLanguage();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [recentEnrollments, setRecentEnrollments] = useState([]);
    const [stats, setStats] = useState({
        totalCredits: 0,
        gpa: 0,
    });
    const [student, setStudent] = useState(null);
    const currentSemester = getCurrentSemester();

    useEffect(() => {
        // Get student from localStorage
        const storedStudent = localStorage.getItem("student");
        if (storedStudent) {
            setStudent(JSON.parse(storedStudent));
        }

        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // Get student from localStorage
            const storedStudent = localStorage.getItem("student");
            if (!storedStudent) return;

            const student = JSON.parse(storedStudent);

            // Fetch enrollment stats
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/api/enrollments/${student.student_id}?stats=true`
            );

            const { enrollments, stats } = response.data;
            setStats(stats);

            // Get the 5 most recent enrollments
            const sortedEnrollments = enrollments.sort((a, b) => {
                // Sort by semester (newest first) and then by date added
                if (a.semester !== b.semester) {
                    return b.semester.localeCompare(a.semester);
                }
                return new Date(b.createdAt) - new Date(a.createdAt);
            });

            setRecentEnrollments(sortedEnrollments.slice(0, 5));
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            setError("Failed to load data");
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Error!</strong>
                <span className="block sm:inline"> {error}</span>
            </div>
        );
    }

    return (
        <>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">{t("home.welcome")}</h1>
                <p className="text-gray-600">{student?.student_name}!</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {/* Current Semester Card */}
                <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-orange-500 hover:translate-y-[-5px] transition-all duration-300">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">{t("home.currentSemester")}</p>
                            <h3 className="text-3xl font-bold mt-2">{currentSemester}</h3>
                            <p className="text-gray-500 text-xs mt-1">{t("home.academicPeriod")}</p>
                        </div>
                        <div className="bg-orange-100 w-10 h-10 flex items-center justify-center rounded-lg">
                            <i className="fas fa-calendar text-orange-600"></i>
                        </div>
                    </div>
                </div>

                {/* GPA Card */}
                <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-blue-500 hover:translate-y-[-5px] transition-all duration-300">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">{t("home.currentCPA")}</p>
                            <h3 className="text-3xl font-bold mt-2">{stats.gpa.toFixed(2)}</h3>
                            <p className="text-gray-500 text-xs mt-1">{t("home.overallCPA")}</p>
                        </div>
                        <div className="bg-blue-100 w-10 h-10 flex items-center justify-center rounded-lg">
                            <i className="fas fa-chart-line text-blue-600"></i>
                        </div>
                    </div>
                </div>

                {/* Credits Card */}
                <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-green-500 hover:translate-y-[-5px] transition-all duration-300">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">{t("home.totalCredits")}</p>
                            <h3 className="text-3xl font-bold mt-2">{stats.totalCredits}</h3>
                            <p className="text-gray-500 text-xs mt-1">{t("home.creditsCompleted")}</p>
                        </div>
                        <div className="bg-green-100 w-10 h-10 flex items-center justify-center rounded-lg">
                            <i className="fas fa-graduation-cap text-green-600"></i>
                        </div>
                    </div>
                </div>

                {/* Courses Card */}
                <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-purple-500 hover:translate-y-[-5px] transition-all duration-300">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">{t("home.totalCourses")}</p>
                            <h3 className="text-3xl font-bold mt-2">
                                {loading
                                    ? "..."
                                    : recentEnrollments.length > 0
                                    ? new Set(recentEnrollments.map((e) => e.course?._id)).size
                                    : 0}
                            </h3>
                            <p className="text-gray-500 text-xs mt-1">{t("home.coursesRegistered")}</p>
                        </div>
                        <div className="bg-purple-100 w-10 h-10 flex items-center justify-center rounded-lg">
                            <i className="fas fa-book text-purple-600"></i>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Enrollments */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">{t("home.recentEnrollments")}</h2>
                    <Link href="/enrollments" className="text-red-600 hover:text-red-800 text-sm font-medium">
                        {t("home.viewAll")}
                    </Link>
                </div>

                {recentEnrollments.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {t("home.course")}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {t("home.semester")}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {t("home.status")}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {t("home.grade")}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {recentEnrollments.map((enrollment) => (
                                    <tr key={enrollment._id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {enrollment.course?.course_code}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {enrollment.course?.course_name?.en || enrollment.course?.course_name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {enrollment.semester}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    enrollment.status === "Completed"
                                                        ? "bg-green-100 text-green-800"
                                                        : enrollment.status === "In Progress"
                                                        ? "bg-blue-100 text-blue-800"
                                                        : "bg-yellow-100 text-yellow-800"
                                                }`}
                                            >
                                                {enrollment.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {enrollment.final_grade ? (
                                                <span
                                                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        enrollment.gpa_scale >= 3.5
                                                            ? "bg-green-200 text-green-900"
                                                            : enrollment.gpa_scale >= 3.0
                                                            ? "bg-blue-200 text-blue-900"
                                                            : enrollment.gpa_scale >= 2.5
                                                            ? "bg-yellow-200 text-yellow-900"
                                                            : enrollment.gpa_scale >= 2.0
                                                            ? "bg-orange-200 text-orange-900"
                                                            : enrollment.gpa_scale >= 1.5
                                                            ? "bg-red-200 text-red-900"
                                                            : enrollment.gpa_scale >= 1.0
                                                            ? "bg-rose-200 text-rose-900"
                                                            : "bg-red-300 text-red-900"
                                                    }`}
                                                >
                                                    {enrollment.final_grade} ({enrollment.gpa_scale.toFixed(1)})
                                                </span>
                                            ) : (
                                                <span className="text-gray-400 text-sm">Not graded</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-500">{t("home.noEnrollments")}</p>
                        <Link href="/courses" className="mt-2 inline-block text-red-600 hover:text-red-800">
                            {t("home.browseCourses")}
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
};

export default withAuth(Home);
