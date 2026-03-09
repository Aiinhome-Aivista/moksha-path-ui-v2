import { useContext } from 'react';
import type { AuthContextType } from '../app/providers/AuthProvider';
import { AuthContext } from '../app/providers/AuthProvider';

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
};

export default useAuth;
