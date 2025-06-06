"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "../contexts/LanguageContext";

const Footer = () => {
    const pathname = usePathname();
    const { t } = useLanguage();

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
                        <p className="text-gray-300 text-sm">{t("footer.description")}</p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">{t("footer.quickLinks")}</h3>
                        <ul className="space-y-2 text-sm text-gray-300">
                            <li>
                                <Link href="/" className="hover:text-red-400 transition-colors">
                                    {t("nav.home")}
                                </Link>
                            </li>
                            <li>
                                <Link href="/courses" className="hover:text-red-400 transition-colors">
                                    {t("nav.courses")}
                                </Link>
                            </li>
                            <li>
                                <Link href="/enrollments" className="hover:text-red-400 transition-colors">
                                    {t("nav.enrollments")}
                                </Link>
                            </li>
                            <li>
                                <Link href="/students" className="hover:text-red-400 transition-colors">
                                    {t("nav.students")}
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">{t("footer.contact")}</h3>
                        <ul className="space-y-2 text-sm text-gray-300">
                            <li>
                                <a href="mailto:info@husttracker.com" className="hover:text-red-400 transition-colors">
                                    <i className="fas fa-envelope mr-2"></i>onquangtung18052004@gmail.com
                                </a>
                            </li>
                            <li>
                                <a href="tel:+84339813516" className="hover:text-red-400 transition-colors">
                                    <i className="fas fa-phone mr-2"></i>+84 339 813 516
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://g.co/kgs/BvvXkfH"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-red-400 transition-colors"
                                >
                                    <i className="fas fa-map-marker-alt mr-2"></i>
                                    {t("footer.address")}
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t border-red-500 text-center text-sm text-gray-300">
                    <p>
                        &copy; {new Date().getFullYear()} HUST Tracker. {t("footer.rights")}
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
