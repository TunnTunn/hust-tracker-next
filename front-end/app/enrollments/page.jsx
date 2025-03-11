"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import withAuth from "../../hooks/withAuth";
import { getCurrentSemester } from "../../utils/semester";
import EnrollmentTable from "../../components/EnrollmentTable";

const EnrollmentsPage = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({
        totalCredits: 0,
        gpa: 0,
    });
    const [courses, setCourses] = useState([]);
    const [quickFormData, setQuickFormData] = useState({
        course: "",
        semester: getCurrentSemester(),
        final_grade: "",
        midterm_grade: "",
    });
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState("");

    useEffect(() => {
        fetchEnrollments();
        fetchCourses();
    }, []);

    const fetchEnrollments = async () => {
        try {
            const storedStudent = localStorage.getItem("student");
            if (!storedStudent) return;

            const student = JSON.parse(storedStudent);
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/api/enrollments/${student.student_id}?stats=true`
            );

            const { enrollments, stats } = response.data;

            // Sort enrollments by semester (newest first)
            const sortedEnrollments = enrollments.sort((a, b) => {
                return b.semester.localeCompare(a.semester);
            });

            setEnrollments(sortedEnrollments);
            setStats(stats);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching enrollments:", error);
            setError("Failed to load enrollments");
            setLoading(false);
        }
    };

    const fetchCourses = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/courses`);
            setCourses(response.data.allCourses || []);
        } catch (error) {
            console.error("Error fetching courses:", error);
        }
    };

    const handleQuickFormChange = (e) => {
        const { name, value } = e.target;
        setQuickFormData({
            ...quickFormData,
            [name]: value,
        });
    };

    const handleQuickSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setFormError("");

        try {
            const storedStudent = localStorage.getItem("student");
            if (!storedStudent) return;

            const student = JSON.parse(storedStudent);

            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/enrollments`, {
                student_id: student.student_id,
                course: quickFormData.course,
                semester: quickFormData.semester,
                final_grade: quickFormData.final_grade,
                midterm_grade: quickFormData.midterm_grade,
            });

            // Reset form
            setQuickFormData({
                course: "",
                semester: getCurrentSemester(),
                final_grade: "",
                midterm_grade: "",
            });

            // Refresh enrollments
            fetchEnrollments();
            setSubmitting(false);
        } catch (error) {
            console.error("Error adding enrollment:", error);
            setFormError(error.response?.data?.message || "Failed to add enrollment");
            setSubmitting(false);
        }
    };

    const handleDeleteEnrollment = async (id) => {
        if (!confirm("Are you sure you want to delete this enrollment?")) {
            return;
        }

        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/enrollments/${id}`);
            // Refresh enrollments after deletion
            fetchEnrollments();
        } catch (error) {
            console.error("Error deleting enrollment:", error);
            alert("Failed to delete enrollment");
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

    // Group enrollments by semester
    const enrollmentsBySemester = enrollments.reduce((acc, enrollment) => {
        if (!acc[enrollment.semester]) {
            acc[enrollment.semester] = [];
        }
        acc[enrollment.semester].push(enrollment);
        return acc;
    }, {});

    return (
        <>
            <div className="mb-6 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">My Enrollments</h1>
                <Link href="/enrollments/new" className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded">
                    Add New Enrollment
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* GPA Card */}
                <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-blue-500 hover:translate-y-[-5px] transition-all duration-300">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">Current Cumulative GPA</p>
                            <h3 className="text-3xl font-bold mt-2">{stats.gpa.toFixed(2)}</h3>
                            <p className="text-gray-500 text-xs mt-1">Overall grade point average</p>
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
                            <p className="text-gray-600 text-sm font-medium">Total Credits</p>
                            <h3 className="text-3xl font-bold mt-2">{stats.totalCredits}</h3>
                            <p className="text-gray-500 text-xs mt-1">Credits completed</p>
                        </div>
                        <div className="bg-green-100 w-10 h-10 flex items-center justify-center rounded-lg">
                            <i className="fas fa-graduation-cap text-green-600"></i>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Add Form */}
            <div className="bg-white rounded-lg shadow-sm p-6 mt-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Add Enrollment</h2>

                {formError && (
                    <div
                        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
                        role="alert"
                    >
                        <span className="block sm:inline">{formError}</span>
                    </div>
                )}

                <form onSubmit={handleQuickSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div>
                            <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-1">
                                Course
                            </label>
                            <select
                                id="course"
                                name="course"
                                value={quickFormData.course}
                                onChange={handleQuickFormChange}
                                required
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 sm:text-sm"
                            >
                                <option value="">Select a course</option>
                                {courses.map((course) => (
                                    <option key={course._id} value={course._id}>
                                        {course.course_code} - {course.course_name?.en || course.course_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="semester" className="block text-sm font-medium text-gray-700 mb-1">
                                Semester
                            </label>
                            <input
                                type="text"
                                id="semester"
                                name="semester"
                                value={quickFormData.semester}
                                onChange={handleQuickFormChange}
                                required
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 sm:text-sm"
                            />
                        </div>

                        <div>
                            <label htmlFor="midterm_grade" className="block text-sm font-medium text-gray-700 mb-1">
                                Midterm Grade
                            </label>
                            <input
                                type="text"
                                id="midterm_grade"
                                name="midterm_grade"
                                value={quickFormData.midterm_grade}
                                onChange={handleQuickFormChange}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 sm:text-sm"
                            />
                        </div>

                        <div>
                            <label htmlFor="final_grade" className="block text-sm font-medium text-gray-700 mb-1">
                                Final Grade
                            </label>
                            <input
                                type="text"
                                id="final_grade"
                                name="final_grade"
                                value={quickFormData.final_grade}
                                onChange={handleQuickFormChange}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 sm:text-sm"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="inline-flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-400"
                        >
                            {submitting ? "Adding..." : "Add Enrollment"}
                        </button>
                    </div>
                </form>
            </div>

            {/* Enrollments by Semester */}
            {Object.keys(enrollmentsBySemester).length > 0 ? (
                Object.keys(enrollmentsBySemester)
                    .sort((a, b) => b.localeCompare(a))
                    .map((semester) => (
                        <EnrollmentTable
                            key={semester}
                            semester={semester}
                            enrollments={enrollmentsBySemester[semester]}
                            onDelete={handleDeleteEnrollment}
                        />
                    ))
            ) : (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center mt-8">
                    <div className="text-gray-500 mb-4">
                        <i className="fas fa-graduation-cap text-4xl"></i>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No enrollments found</h3>
                    <p className="text-gray-500">You haven't enrolled in any courses yet.</p>
                    <div className="mt-4">
                        <Link
                            href="/courses"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700"
                        >
                            Browse Courses
                        </Link>
                    </div>
                </div>
            )}
        </>
    );
};

export default withAuth(EnrollmentsPage);
