// Role Types
export type Role = 'student' | 'teacher' | 'principal' | 'admin' | 'parent';

export interface RoleConfig {
    id: Role;
    label: string;
    color: string;
    icon: string;
    basePath: string;
}

// Role Configurations
export const ROLES: Record<Role, RoleConfig> = {
    student: {
        id: 'student',
        label: 'Student',
        color: 'bg-blue-500',
        icon: '🎓',
        basePath: '/student',
    },
    teacher: {
        id: 'teacher',
        label: 'Teacher',
        color: 'bg-green-500',
        icon: '👨‍🏫',
        basePath: '/teacher',
    },
    principal: {
        id: 'principal',
        label: 'Principal',
        color: 'bg-purple-500',
        icon: '🏫',
        basePath: '/principal',
    },
    admin: {
        id: 'admin',
        label: 'Admin',
        color: 'bg-red-500',
        icon: '⚙️',
        basePath: '/admin',
    },
    parent: {
        id: 'parent',
        label: 'Parent',
        color: 'bg-yellow-500',
        icon: '👨‍👩‍👧',
        basePath: '/parent',
    },
};

// Helper function to get role config
export const getRoleConfig = (role: Role): RoleConfig => {
    return ROLES[role];
};

// Default role for new users
export const DEFAULT_ROLE: Role = 'student';
