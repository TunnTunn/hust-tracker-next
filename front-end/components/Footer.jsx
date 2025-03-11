"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const Footer = () => {
    const pathname = usePathname();
    // Don't render footer on auth pages - MOVED AFTER HOOKS
    if (pathname?.startsWith("/auth/")) {
        return null;
    }

    return (
        <footer className="bg-red-600 text-white py-8">
            <div className="max-w-7xl mx-auto px-8 py-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-lg font-semibold mb-4">HUST Tracker</h3>
                        <p className="text-gray-300 text-sm">Trường ..., tao tự làm web track điểm.</p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-sm text-gray-300">
                            <li>
                                <a href="/" className="hover:text-red-400 transition-colors">
                                    Dashboard
                                </a>
                            </li>
                            <li>
                                <a href="/courses" className="hover:text-red-400 transition-colors">
                                    Courses
                                </a>
                            </li>
                            <li>
                                <a href="/enrollments" className="hover:text-red-400 transition-colors">
                                    Enrollments
                                </a>
                            </li>
                            <li>
                                <a href="/semesters" className="hover:text-red-400 transition-colors">
                                    Semesters
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Contact</h3>
                        <ul className="space-y-2 text-sm text-gray-300">
                            <li>
                                <a href="mailto:info@husttracker.com" className="hover:text-red-400 transition-colors">
                                    <i className="fas fa-envelope mr-2"></i>info@husttracker.com
                                </a>
                            </li>
                            <li>
                                <a href="tel:+84123456789" className="hover:text-red-400 transition-colors">
                                    <i className="fas fa-phone mr-2"></i>+84 123 456 789
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://goo.gl/maps/1234"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-red-400 transition-colors"
                                >
                                    <i className="fas fa-map-marker-alt mr-2"></i>Hanoi, Vietnam
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t border-red-500 text-center text-sm text-gray-300">
                    <p>&copy; {new Date().getFullYear()} HUST Tracker. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
