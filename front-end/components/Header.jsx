"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";

const Header = () => {
    const router = useRouter();
    const pathname = usePathname();
    const [student, setStudent] = useState(null);
    const { language, toggleLanguage, t } = useLanguage();

    useEffect(() => {
        // Get student from localStorage on component mount
        const storedStudent = localStorage.getItem("student");
        if (storedStudent) {
            try {
                setStudent(JSON.parse(storedStudent));
            } catch (error) {
                console.error("Error parsing student data:", error);
                // Clear invalid data
                localStorage.removeItem("student");
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("student");
        setStudent(null);
        router.push("/auth/login");
    };

    // Don't render header on auth pages - MOVED AFTER HOOKS
    if (pathname?.startsWith("/auth/")) {
        return null;
    }

    return (
        <header className="bg-red-600 shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-8 py-5">
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <Link href="/" className="text-xl font-bold text-white">
                            HUST Tracker
                        </Link>
                    </div>

                    {student && (
                        <nav className="hidden md:flex space-x-6 mx-auto">
                            <Link
                                href="/"
                                className={`rounded-md px-4 py-2 hover:underline ${
                                    pathname === "/" ? "bg-white text-red-600" : "text-white"
                                }`}
                            >
                                {t("nav.home")}
                            </Link>
                            <Link
                                href="/courses"
                                className={`rounded-md px-4 py-2 hover:underline ${
                                    pathname === "/courses" ? "bg-white text-red-600" : "text-white"
                                }`}
                            >
                                {t("nav.courses")}
                            </Link>
                            <Link
                                href="/enrollments"
                                className={`rounded-md px-4 py-2 hover:underline ${
                                    pathname === "/enrollments" ? "bg-white text-red-600" : "text-white"
                                }`}
                            >
                                {t("nav.enrollments")}
                            </Link>
                            <Link
                                href="/students"
                                className={`rounded-md px-4 py-2 hover:underline ${
                                    pathname === "/students" ? "bg-white text-red-600" : "text-white"
                                }`}
                            >
                                {t("nav.students")}
                            </Link>
                        </nav>
                    )}

                    <div className="flex items-center space-x-4 ml-auto">
                        <button
                            onClick={toggleLanguage}
                            className="bg-white text-red-600 px-4 py-2 rounded-md text-sm transition-all duration-200 transform hover:scale-105"
                        >
                            {language === "en" ? "VI" : "EN"}
                        </button>
                        {student && (
                            <div className="flex items-center space-x-4">
                                <button className="bg-white text-red-600 px-4 py-2 rounded-md text-sm transition-all duration-200 transform hover:scale-105">
                                    <Link href="/profile">
                                        <i className="fas fa-user"></i> {student.student_name || t("nav.profile")}
                                    </Link>
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="bg-white text-red-600 px-4 py-2 rounded-md text-sm transition-all duration-200 transform hover:scale-105"
                                >
                                    {t("nav.logout")}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
