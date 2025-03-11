"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";

const Signup = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        student_id: "",
        student_name: "",
        student_email: "",
        student_password: "",
        enrollment_year: new Date().getFullYear(),
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
                student_id: formData.student_id,
                student_name: formData.student_name,
                student_email: formData.student_email,
                student_password: formData.student_password,
                enrollment_year: formData.enrollment_year,
            });
            router.push("/auth/login?registered=true");
        } catch (error) {
            console.error("Registration error:", error);

            if (error.response) {
                if (error.response.data && error.response.data.message) {
                    setError(error.response.data.message);
                } else {
                    setError(`Server error: ${error.response.status}`);
                }
            } else if (error.request) {
                setError("No response from server. Please check your internet connection.");
            } else {
                setError("Registration failed. Please try again.");
            }

            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">HUST Tracker</h2>
                    <h3 className="mt-2 text-center text-xl font-bold text-gray-900">Create a new account</h3>
                </div>

                {error && (
                    <div
                        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                        role="alert"
                    >
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="student_id" className="sr-only">
                                Student ID
                            </label>
                            <input
                                id="student_id"
                                name="student_id"
                                type="text"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                                placeholder="Student ID"
                                value={formData.student_id}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="student_name" className="sr-only">
                                Full Name
                            </label>
                            <input
                                id="student_name"
                                name="student_name"
                                type="text"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                                placeholder="Full Name"
                                value={formData.student_name}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="student_email" className="sr-only">
                                Email address
                            </label>
                            <input
                                id="student_email"
                                name="student_email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                                placeholder="Email address"
                                value={formData.student_email}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="student_password" className="sr-only">
                                Password
                            </label>
                            <input
                                id="student_password"
                                name="student_password"
                                type="password"
                                autoComplete="new-password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                                placeholder="Password"
                                value={formData.student_password}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="text-sm">
                            <Link href="/auth/login" className="font-medium text-red-600 hover:text-red-500">
                                Already have an account? Sign in
                            </Link>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-400"
                        >
                            {loading ? "Creating account..." : "Sign up"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signup;
