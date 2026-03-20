import { createBrowserRouter, type RouteObject, Navigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import Login from "../features/auth/modal/Login";
import { SelectRole } from "../features/auth/modal/SelectRole";
import StudentDashboard from "../features/student/pages/Dashboard";
import StudentProfile from "../features/student/pages/Profile";
import Subscription from "../features/student/pages/Subscription";
import SubscriptionDetails from "../features/student/pages/SubscriptionDetails";
import TransactionHistory from "../features/student/pages/TransactionHistory";
import PaymentGateway from "../features/student/pages/PaymentGateway";
import LandingPage from "../features/landingpage/pages/LandingPage";
import LearningPlanner from "../features/student/pages/LearningPlanner";
import StudentMaterials from "../features/student/pages/StudentMaterials";
import Notifications from "../features/student/pages/Notifications";
import Invitations from "../features/student/pages/Invitations";
import ParentDashboard from "../features/parent/pages/ParentDashboard";
import ParentMaterials from "../features/parent/pages/ParentMaterials";
import TeacherMaterials from "../features/teacher/pages/TeacherMaterials";
import { TeacherDashboard } from "../features/teacher/pages/TeacherDashboard";
import ParentLearningPlanner from "../features/parent/pages/ParentLearningPlanner";
import TeacherLearningPlanner from "../features/teacher/pages/TeacherLearningPlanner";

import Blogs from "../features/blog/blogpage";
import BlogDetail from "../features/blog/blogdetail";

// Admin Imports
import AdminLayout from "../components/layout/AdminLayout";
import AdminDashboard from "../features/admin/pages/AdminDashboard";
import ManageBlog from "../features/admin/pages/blog/ManageBlog";
import AddBlog from "../features/admin/pages/blog/AddBlog";
import ManageSEO from "../features/admin/pages/seo/ManageSEO";
import AddSEO from "../features/admin/pages/seo/AddSEO";
import AddCategory from "../features/admin/pages/category/AddCategory";
import ManageCategory from "../features/admin/pages/category/ManageCategory";
import AdminLogin from "../features/admin/pages/category/AdminLogin";
import InstituteAdminDashboard from "../features/institute-admin/pages/InstituteAdminDashboard";

const routes: RouteObject[] = [
  // Standalone Routes
  { path: "/login", element: <Login /> },
  { path: "/select-role", element: <SelectRole /> },

  // App Routes (Header + Sidebar + Content)
  {
    element: <AppLayout />,
    children: [
      // Public / Landing
      { path: "/", element: <LandingPage /> },
      { path: "blogs", element: <Blogs /> },
      { path: "blogs/:title", element: <BlogDetail /> },

      // Student Routes
      { path: "dashboard", element: <StudentDashboard /> },
      { path: "profile", element: <StudentProfile /> },

      // Student Features
      // { path: 'subscription', element: <Subscription /> },
      { path: "subscription", element: <Subscription /> },
      { path: "subscription-details", element: <SubscriptionDetails /> },
      { path: "transaction-history", element: <TransactionHistory /> },
      { path: "payment", element: <PaymentGateway /> },
      { path: "learning-planner", element: <LearningPlanner /> },
      { path: "student-materials", element: <StudentMaterials /> },
      // clean direct routes (optional but recommended)
      { path: "tests", element: <StudentMaterials /> },
      { path: "videos", element: <StudentMaterials /> },
      { path: "notes", element: <StudentMaterials /> },
      { path: "practice", element: <StudentMaterials /> },

      //teacher routes
      { path: "notification", element: <Notifications /> },
      { path: "invitation", element: <Invitations /> },
      { path: "teacher-material", element: <TeacherMaterials /> },
      { path: "teacher/dashboard", element: <TeacherDashboard /> },
      { path: "teacher/teacherlearning-planner", element: <TeacherLearningPlanner /> },
      { path: "teacher-tests", element: <TeacherMaterials /> },
      { path: "teacher-videos", element: <TeacherMaterials /> },
      { path: "teacher-notes", element: <TeacherMaterials /> },

      //parent routes
      { path: "parent/dashboard", element: <ParentDashboard /> },
      { path: "parent/parentlearning-planner", element: <ParentLearningPlanner /> },
      { path: "parent-material", element: <ParentMaterials /> },
      { path: "parent-tests", element: <ParentMaterials /> },
      { path: "parent-videos", element: <ParentMaterials /> },
      { path: "parent-notes", element: <ParentMaterials /> },


      //institute-admin/dashboard
      { path: "institute-admin/dashboard", element: <InstituteAdminDashboard /> },
      
    ],
  },

  // Role Portals (Placeholders)
  {
    path: "teacher/",
    element: <PlaceholderPage title="Teacher Portal - Coming Soon" />,
  },
  {
    path: "principal/",
    element: <PlaceholderPage title="Principal Portal - Coming Soon" />,
  },

  // Independent Admin Routes Structure
  {
    path: "/admin",
    children: [
      { path: "login", element: <AdminLogin /> },
      {
        element: <AdminLayout />,
        children: [
          { path: "", element: <Navigate to="dashboard" replace /> },
          { path: "dashboard", element: <AdminDashboard /> },
          { path: "manage-blog", element: <ManageBlog /> },
          { path: "add-blog", element: <AddBlog /> },
          { path: "manage-seo", element: <ManageSEO /> },
          { path: "add-seo", element: <AddSEO /> },
          { path: "manage-categories", element: <ManageCategory /> },
          { path: "add-category", element: <AddCategory isOpen={true} onClose={() => { }} editId={null} /> },
        ],
      },
    ],
  },

  { path: "parent/", element: <ParentDashboard /> },
  {
    path: "institute-admin/dashboard",
    element: <PlaceholderPage title="Institution Portal - Coming Soon" />,
  },
  {
    path: "group/",
    element: <PlaceholderPage title="Group Portal - Coming Soon" />,
  },

  // 404 Fallback
  { path: "*", element: <NotFoundPage /> },
];

// --- Helper Components ---

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">🚧</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
        <p className="text-gray-500">This page is under construction.</p>
      </div>
    </div>
  );
}

function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
        <p className="text-gray-500 mb-6">Page not found</p>
        <a
          href="/login"
          className="inline-flex items-center gap-2 px-4 py-2 bg-lime-500 text-white rounded-full hover:bg-lime-600 transition-colors"
        >
          Go Home
        </a>
      </div>
    </div>
  );
}

export const router = createBrowserRouter(routes);
export default router;
