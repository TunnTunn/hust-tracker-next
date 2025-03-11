"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import withAuth from "../../hooks/withAuth";
import Link from "next/link";
import useDebounce from "../../hooks/useDebounce";
import { getCurrentSemester } from "../../utils/semester";
import CourseCard from "../../components/CourseCard";

const CoursesPage = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    useEffect(() => {
        fetchCourses();
    }, []);

    useEffect(() => {
        if (debouncedSearchTerm) {
            searchCourses(debouncedSearchTerm);
        } else {
            fetchCourses();
        }
    }, [debouncedSearchTerm]);

    const fetchCourses = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/courses`);
            setCourses(response.data.allCourses);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching courses:", error);
            setError("Failed to load courses");
            setLoading(false);
        }
    };

    const searchCourses = async (term) => {
        setLoading(true);
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/courses?search=${term}`);
            setCourses(response.data.allCourses);
            setLoading(false);
        } catch (error) {
            console.error("Error searching courses:", error);
            setError("Failed to search courses");
            setLoading(false);
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleEnroll = async (courseId) => {
        try {
            const storedStudent = localStorage.getItem("student");
            if (!storedStudent) return;

            const student = JSON.parse(storedStudent);
            const currentSemester = getCurrentSemester();

            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/enrollments`, {
                student_id: student.student_id,
                course: courseId,
                semester: currentSemester,
                status: "In Progress",
            });

            alert("Successfully enrolled in course!");
        } catch (error) {
            console.error("Error enrolling in course:", error);
            alert(error.response?.data?.message || "Failed to enroll in course");
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
                <h1 className="text-2xl font-bold text-gray-800">Courses</h1>
                <p className="text-gray-600">Browse all available courses</p>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i className="fas fa-search text-gray-400"></i>
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 sm:text-sm"
                        placeholder="Search courses by name or code..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </div>
            </div>

            {/* Course Grid */}
            {courses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => (
                        <CourseCard key={course._id} course={course} />
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                    <div className="text-gray-500 mb-4">
                        <i className="fas fa-search text-4xl"></i>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
                    <p className="text-gray-500">
                        {searchTerm
                            ? `No courses match "${searchTerm}"`
                            : "There are no courses available at the moment."}
                    </p>
                </div>
            )}
        </>
    );
};

export default withAuth(CoursesPage);
