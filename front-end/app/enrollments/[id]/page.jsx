"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import withAuth from "../../../hooks/withAuth";
import Link from "next/link";

const EditEnrollmentPage = ({ params }) => {
    const router = useRouter();
    const { id } = params;
    const [courses, setCourses] = useState([]);
    const [semesters, setSemesters] = useState(["2023-1", "2023-2", "2024-1", "2024-2"]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        course: "",
        semester: "",
        status: "",
        final_grade: "",
        gpa_scale: "",
    });

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            // Fetch enrollment data
            const enrollmentResponse = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/api/enrollments/detail/${id}`
            );

            // Fetch courses
            const coursesResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/courses`);

            setCourses(coursesResponse.data);

            const enrollment = enrollmentResponse.data;
            setFormData({
                course: enrollment.course._id,
                semester: enrollment.semester,
                status: enrollment.status,
                final_grade: enrollment.final_grade || "",
                gpa_scale: enrollment.gpa_scale ? enrollment.gpa_scale.toString() : "",
            });

            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            setError("Failed to load enrollment data");
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Handle grade conversion
        if (name === "final_grade") {
            let gpaScale = "";

            switch (value) {
                case "A+":
                    gpaScale = "4.0";
                    break;
                case "A":
                    gpaScale = "4.0";
                    break;
                case "A-":
                    gpaScale = "3.7";
                    break;
                case "B+":
                    gpaScale = "3.3";
                    break;
                case "B":
                    gpaScale = "3.0";
                    break;
                case "B-":
                    gpaScale = "2.7";
                    break;
                case "C+":
                    gpaScale = "2.3";
                    break;
                case "C":
                    gpaScale = "2.0";
                    break;
                case "C-":
                    gpaScale = "1.7";
                    break;
                case "D+":
                    gpaScale = "1.3";
                    break;
                case "D":
                    gpaScale = "1.0";
                    break;
                case "F":
                    gpaScale = "0.0";
                    break;
                default:
                    gpaScale = "";
            }

            setFormData((prev) => ({
                ...prev,
                [name]: value,
                gpa_scale: gpaScale,
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            // Prepare data for submission
            const enrollmentData = {
                ...formData,
                final_grade: formData.final_grade || null,
                gpa_scale: formData.gpa_scale ? parseFloat(formData.gpa_scale) : null,
            };

            await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/enrollments/${id}`, enrollmentData);

            // Redirect to enrollments page after successful update
            router.push("/enrollments");
        } catch (error) {
            console.error("Error updating enrollment:", error);
            setError(error.response?.data?.message || "An error occurred while updating the enrollment");
            setSubmitting(false);
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
                <h1 className="text-2xl font-bold text-gray-800">Edit Enrollment</h1>
                <p className="text-gray-600">Update your enrollment details</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-1">
                                Course *
                            </label>
                            <select
                                id="course"
                                name="course"
                                required
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                value={formData.course}
                                onChange={handleChange}
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
                                Semester *
                            </label>
                            <select
                                id="semester"
                                name="semester"
                                required
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                value={formData.semester}
                                onChange={handleChange}
                            >
                                <option value="">Select a semester</option>
                                {semesters.map((semester) => (
                                    <option key={semester} value={semester}>
                                        {semester}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                                Status *
                            </label>
                            <select
                                id="status"
                                name="status"
                                required
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                value={formData.status}
                                onChange={handleChange}
                            >
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                                <option value="Withdrawn">Withdrawn</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="final_grade" className="block text-sm font-medium text-gray-700 mb-1">
                                Final Grade
                            </label>
                            <select
                                id="final_grade"
                                name="final_grade"
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                value={formData.final_grade}
                                onChange={handleChange}
                            >
                                <option value="">Not graded yet</option>
                                <option value="A+">A+</option>
                                <option value="A">A</option>
                                <option value="A-">A-</option>
                                <option value="B+">B+</option>
                                <option value="B">B</option>
                                <option value="B-">B-</option>
                                <option value="C+">C+</option>
                                <option value="C">C</option>
                                <option value="C-">C-</option>
                                <option value="D+">D+</option>
                                <option value="D">D</option>
                                <option value="F">F</option>
                            </select>
                            <p className="mt-1 text-sm text-gray-500">Leave blank if the course is not completed yet</p>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end space-x-3">
                        <Link
                            href="/enrollments"
                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="inline-flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-400"
                        >
                            {submitting ? "Saving..." : "Update Enrollment"}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default withAuth(EditEnrollmentPage);
