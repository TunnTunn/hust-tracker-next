"use client";

import { createContext, useContext, useState } from "react";
import { locales } from "../locale";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
    const [currentLanguage, setCurrentLanguage] = useState("en"); // Default language is English

    const toggleLanguage = () => {
        setCurrentLanguage((prevLang) => (prevLang === "en" ? "vi" : "en"));
    };

    // Get the current locale
    const language = currentLanguage;
    const t = (key) => {
        const keys = key.split(".");
        let value = locales[currentLanguage];

        for (const k of keys) {
            if (value === undefined) return key;
            value = value[k];
        }

        return value || key;
    };

    return <LanguageContext.Provider value={{ language, toggleLanguage, t }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}
