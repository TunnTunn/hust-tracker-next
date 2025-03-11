"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import withAuth from "../../../hooks/withAuth";
import { getCurrentSemester } from "../../../utils/semester";

const CourseDetailPage = ({ params }) => {
    const router = useRouter();
    const { id } = params;
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [enrolling, setEnrolling] = useState(false);
    const [enrolled, setEnrolled] = useState(false);
    const [student, setStudent] = useState(null);

    useEffect(() => {
        const storedStudent = localStorage.getItem("student");
        if (storedStudent) {
            setStudent(JSON.parse(storedStudent));
        }

        fetchCourse();
        checkEnrollmentStatus();
    }, [id]);

    const fetchCourse = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/${id}`);
            setCourse(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching course:", error);
            setError("Failed to load course details");
            setLoading(false);
        }
    };

    const checkEnrollmentStatus = async () => {
        try {
            const storedStudent = localStorage.getItem("student");
            if (!storedStudent) return;

            const student = JSON.parse(storedStudent);
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/api/enrollments/${student.student_id}`
            );

            const enrollments = response.data.enrollments || [];
            const isEnrolled = enrollments.some((enrollment) => enrollment.course?._id === id);
            setEnrolled(isEnrolled);
        } catch (error) {
            console.error("Error checking enrollment status:", error);
        }
    };

    const handleEnroll = async () => {
        setEnrolling(true);
        try {
            const storedStudent = localStorage.getItem("student");
            if (!storedStudent) return;

            const student = JSON.parse(storedStudent);
            const currentSemester = getCurrentSemester();

            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/enrollments`, {
                student_id: student.student_id,
                course: id,
                semester: currentSemester,
                midterm_grade: "",
                final_grade: "",
            });

            setEnrolled(true);
            setEnrolling(false);
            alert("Successfully enrolled in this course!");
        } catch (error) {
            console.error("Error enrolling in course:", error);
            alert(error.response?.data?.message || "Failed to enroll in course");
            setEnrolling(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
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

    if (!course) {
        return (
            <div
                className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative"
                role="alert"
            >
                <strong className="font-bold">Course not found!</strong>
                <span className="block sm:inline"> The requested course could not be found.</span>
            </div>
        );
    }

    return (
        <>
            {/* Breadcrumb */}
            <nav className="flex mb-6" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-3">
                    <li className="inline-flex items-center">
                        <Link href="/" className="text-gray-700 hover:text-red-600">
                            <i className="fas fa-home mr-2"></i>
                            Home
                        </Link>
                    </li>
                    <li>
                        <div className="flex items-center">
                            <i className="fas fa-chevron-right text-gray-400 mx-2"></i>
                            <Link href="/courses" className="text-gray-700 hover:text-red-600">
                                Courses
                            </Link>
                        </div>
                    </li>
                    <li aria-current="page">
                        <div className="flex items-center">
                            <i className="fas fa-chevron-right text-gray-400 mx-2"></i>
                            <span className="text-gray-500">{course.course_code}</span>
                        </div>
                    </li>
                </ol>
            </nav>

            {/* Course Header */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">{course.course_name?.vi}</h1>
                        <p className="text-lg text-gray-600 mb-4">{course.course_name?.en}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                            <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                                {course.course_code}
                            </span>
                            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                                {course.course_credit} Credits
                            </span>
                            {course.department && (
                                <span className="bg-gray-100 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                                    {course.department}
                                </span>
                            )}
                            {course.final_weight && (
                                <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                                    Final: {course.final_weight}%
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="mt-4 md:mt-0">
                        {enrolled ? (
                            <div className="bg-green-100 text-green-800 px-4 py-2 rounded-md inline-flex items-center">
                                <i className="fas fa-check-circle mr-2"></i>
                                Already Enrolled
                            </div>
                        ) : (
                            <button
                                onClick={handleEnroll}
                                disabled={enrolling}
                                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md shadow-sm disabled:bg-red-400"
                            >
                                {enrolling ? "Enrolling..." : "Enroll Now"}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Course Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="md:col-span-2">
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Course Description</h2>
                        <p className="text-gray-600 mb-6">
                            {course.description || "No description available for this course."}
                        </p>

                        {course.prerequisites && course.prerequisites.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Prerequisites</h3>
                                <ul className="list-disc pl-5 text-gray-600">
                                    {course.prerequisites.map((prereq, index) => (
                                        <li key={index}>{prereq}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {course.syllabus && (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Syllabus</h3>
                                <div className="text-gray-600">
                                    <p>{course.syllabus}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div>
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Course Information</h2>
                        <ul className="space-y-3">
                            <li className="flex justify-between">
                                <span className="text-gray-600">Code:</span>
                                <span className="font-medium text-gray-900">{course.course_code}</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-gray-600">Credits:</span>
                                <span className="font-medium text-gray-900">{course.course_credit}</span>
                            </li>
                            {course.department && (
                                <li className="flex justify-between">
                                    <span className="text-gray-600">Department:</span>
                                    <span className="font-medium text-gray-900">{course.department}</span>
                                </li>
                            )}
                            {course.instructor && (
                                <li className="flex justify-between">
                                    <span className="text-gray-600">Instructor:</span>
                                    <span className="font-medium text-gray-900">{course.instructor}</span>
                                </li>
                            )}
                            {course.final_weight && (
                                <li className="flex justify-between">
                                    <span className="text-gray-600">Final Weight:</span>
                                    <span className="font-medium text-gray-900">{course.final_weight}%</span>
                                </li>
                            )}
                            {course.midterm_weight && (
                                <li className="flex justify-between">
                                    <span className="text-gray-600">Midterm Weight:</span>
                                    <span className="font-medium text-gray-900">{course.midterm_weight}%</span>
                                </li>
                            )}
                        </ul>
                    </div>

                    {/* Related Courses */}
                    {course.related_courses && course.related_courses.length > 0 && (
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Related Courses</h2>
                            <ul className="space-y-2">
                                {course.related_courses.map((relatedCourse, index) => (
                                    <li key={index}>
                                        <Link
                                            href={`/courses/${relatedCourse._id}`}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            {relatedCourse.course_code} -{" "}
                                            {relatedCourse.course_name?.en || relatedCourse.course_name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default withAuth(CourseDetailPage);
