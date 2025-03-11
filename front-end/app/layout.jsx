import { Lexend } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

const lexend = Lexend({ subsets: ["latin"] });

export const metadata = {
    title: "HUST Tracker",
    description: "Student Management System for HUST",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <link
                    rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
                />
            </head>
            <body className={lexend.className}>
                <div className="flex flex-col min-h-screen">
                    <Header />
                    <main className="flex-grow bg-white">
                        <div className="max-w-7xl mx-auto px-8 py-8">{children}</div>
                    </main>
                    <Footer />
                </div>
            </body>
        </html>
    );
}
