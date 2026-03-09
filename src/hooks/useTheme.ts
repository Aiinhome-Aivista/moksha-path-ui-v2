import { useContext } from 'react';
import type { ThemeContextType } from '../app/providers/ThemeProvider';
import { ThemeContext } from '../app/providers/ThemeProvider';

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);

    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }

    return context;
};

export default useTheme;
