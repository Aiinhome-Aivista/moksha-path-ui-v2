export type ThemeMode = 'light' | 'dark';

export interface ThemeConfig {
    mode: ThemeMode;
    colors: {
        primary: string;
        secondary: string;
        background: string;
        text: string;
        border: string;
        accent: string;
    };
}

export const LIGHT_THEME: ThemeConfig = {
    mode: 'light',
    colors: {
        primary: '#3b82f6',
        secondary: '#64748b',
        background: '#ffffff',
        text: '#1e293b',
        border: '#e2e8f0',
        accent: '#2563eb',
    },
};

export const DARK_THEME: ThemeConfig = {
    mode: 'dark',
    colors: {
        primary: '#60a5fa',
        secondary: '#94a3b8',
        background: '#0f172a',
        text: '#f1f5f9',
        border: '#334155',
        accent: '#3b82f6',
    },
};

export const getTheme = (mode: ThemeMode): ThemeConfig => {
    return mode === 'dark' ? DARK_THEME : LIGHT_THEME;
};

export const APP_NAME = 'MokshaPath';
export const APP_DESCRIPTION = 'EdTech Platform for Learning Excellence';
