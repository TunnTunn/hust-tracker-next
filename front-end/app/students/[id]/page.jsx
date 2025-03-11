"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import withAuth from "../../../hooks/withAuth";
import Link from "next/link";

const StudentDetailPage = ({ params }) => {
    const router = useRouter();
    const { id } = params;
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [enrollments, setEnrollments] = useState([]);

    useEffect(() => {
        const fetchStudentData = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("token");
                if (!token) {
                    router.push("/auth/login");
                    return;
                }

                // Fetch student details
                const studentResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/students/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!studentResponse.ok) {
                    throw new Error("Failed to fetch student data");
                }

                const studentData = await studentResponse.json();
                setStudent(studentData);

                // Fetch student enrollments
                const enrollmentsResponse = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/students/${id}/enrollments`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!enrollmentsResponse.ok) {
                    throw new Error("Failed to fetch student enrollments");
                }

                const enrollmentsData = await enrollmentsResponse.json();
                setEnrollments(enrollmentsData);
            } catch (err) {
                console.error("Error fetching student data:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchStudentData();
        }
    }, [id, router]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
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

    if (!student) {
        return (
            <div
                className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative"
                role="alert"
            >
                <strong className="font-bold">Not Found!</strong>
                <span className="block sm:inline"> Student not found.</span>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Student Details</h1>
                <div className="space-x-2">
                    <Link href="/students" className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
                        Back to Students
                    </Link>
                </div>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <p className="text-sm text-gray-500">Student ID</p>
                        <p className="text-lg font-medium">{student.student_id}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Name</p>
                        <p className="text-lg font-medium">{student.student_name}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="text-lg font-medium">{student.student_email}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Enrollment Year</p>
                        <p className="text-lg font-medium">{student.enrollment_year}</p>
                    </div>
                </div>
            </div>

            <h2 className="text-xl font-bold text-gray-800 mb-4">Enrollments</h2>
            {enrollments.length > 0 ? (
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Course
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Semester
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Midterm Grade
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Final Grade
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {enrollments.map((enrollment) => (
                                <tr key={enrollment.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            {enrollment.course?.course_code} - {enrollment.course?.course_name}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{enrollment.semester?.name}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {enrollment.midterm_grade !== null ? enrollment.midterm_grade : "-"}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {enrollment.final_grade !== null ? enrollment.final_grade : "-"}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <Link
                                            href={`/enrollments/${enrollment._id}`}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="bg-white shadow-md rounded-lg p-6">
                    <p className="text-gray-500">No enrollments found for this student.</p>
                </div>
            )}
        </div>
    );
};

export default withAuth(StudentDetailPage);
