import React, { createContext, useState, useEffect, type ReactNode } from 'react';
import type { ThemeMode, ThemeConfig } from '../../config/theme';
import { getTheme } from '../../config/theme';

export interface ThemeContextType {
    theme: ThemeConfig;
    mode: ThemeMode;
    toggleTheme: () => void;
    setTheme: (mode: ThemeMode) => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
    children: ReactNode;
}

const THEME_STORAGE_KEY = 'mokshapath-theme';

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const [mode, setMode] = useState<ThemeMode>(() => {
        // Check local storage for saved theme
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode;
            if (saved === 'light' || saved === 'dark') {
                return saved;
            }
            // Check system preference
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                return 'dark';
            }
        }
        return 'light';
    });

    const [theme, setThemeConfig] = useState<ThemeConfig>(getTheme(mode));

    useEffect(() => {
        // Update theme config when mode changes
        setThemeConfig(getTheme(mode));

        // Save to local storage
        localStorage.setItem(THEME_STORAGE_KEY, mode);

        // Update document class for Tailwind dark mode
        if (mode === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [mode]);

    const toggleTheme = () => {
        setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
    };

    const setTheme = (newMode: ThemeMode) => {
        setMode(newMode);
    };

    const value: ThemeContextType = {
        theme,
        mode,
        toggleTheme,
        setTheme,
    };

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export default ThemeProvider;
