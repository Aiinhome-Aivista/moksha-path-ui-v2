// MenuItem interface and config
export interface MenuItem {
    id: string;
    label: string;
    path: string;
    icon: string;
    submenu?: MenuItem[];
}

export const menuConfig = {
    student: {
        items: [
            {
                id: 'home',
                label: 'Home',
                path: '/student/home',
                icon: 'Home',
            },
            {
                id: 'profile',
                label: 'My Profile',
                path: '/student/profile',
                icon: 'User',
            },
            {
                id: 'dashboard',
                label: 'My Dashboard',
                path: '/student/dashboard',
                icon: 'LayoutDashboard',
            },
            {
                id: 'learning-plan',
                label: 'My Learning Plan',
                path: '/student/learning-plan',
                icon: 'FileText',
            },
            {
                id: 'assessments',
                label: 'My Assessments',
                path: '/student/assessments',
                icon: 'ClipboardCheck',
            },
            {
                id: 'tutorials',
                label: 'Video Tutorials',
                path: '/student/tutorials',
                icon: 'Video',
            },
            {
                id: 'tests',
                label: 'My Tests',
                path: '/student/tests',
                icon: 'PenTool',
            },
            {
                id: 'notes',
                label: 'Notes',
                path: '/student/notes',
                icon: 'StickyNote',
            },
            {
                id: 'subscription',
                label: 'My Subscription',
                path: '/student/subscription',
                icon: 'CreditCard',
            },
            {
                id: 'referral',
                label: 'Referral',
                path: '/student/referral',
                icon: 'Users',
            },
        ],
    },
    admin: {
        items: [
            {
                id: 'dashboard',
                label: 'Dashboard',
                path: '/admin/dashboard',
                icon: 'LayoutDashboard',
            },
            {
                id: 'users',
                label: 'Users',
                path: '/admin/users',
                icon: 'Users',
            },
        ],
    },
    instructor: {
        items: [
            {
                id: 'dashboard',
                label: 'Dashboard',
                path: '/instructor/dashboard',
                icon: 'LayoutDashboard',
            },
            {
                id: 'courses',
                label: 'My Courses',
                path: '/instructor/courses',
                icon: 'Video',
            },
        ],
    },
};

export const getMenuItems = (role: string): MenuItem[] => {
    return menuConfig[role as keyof typeof menuConfig]?.items || [];
};
