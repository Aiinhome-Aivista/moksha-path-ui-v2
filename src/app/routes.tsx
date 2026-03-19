import { createBrowserRouter, type RouteObject, Navigate, useRouteError, isRouteErrorResponse } from "react-router-dom";
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
import TDashboard from "../components/t_dashboard/dashboard";
import OverviewTab from "../components/t_dashboard/overviewTab";
import SyllabusTab from "../components/t_dashboard/syllabusTab";
import MockExamsTab from "../components/t_dashboard/mockExamsTab";
import RemediationTab from "../components/t_dashboard/remediationTab";
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
import InstituteAdminMaterials from "../features/institute-admin/pages/InstituteAdminMaterials";
import InstituteadminLearningPlanner from "../features/institute-admin/pages/InstituteadminLearningPlanner";
import InstituteAdminNotification from "../features/institute-admin/pages/InstituteAdminNotification";
import InstituteAdminProfile from "../features/institute-admin/pages/InstituteAdminProfile";
import TutorProfile from "../features/private-tutor/pages/TutorProfile";
import TutorDashboard from "../features/private-tutor/pages/TutorDashboard";
import TutorLearningPlanner from "../features/private-tutor/pages/TutorLearningPlanner";
import TutorNotifications from "../features/private-tutor/pages/TutorNotification";
import TutorMaterials from "../features/private-tutor/pages/TutorMaterials";


const routes: RouteObject[] = [
  // Standalone Routes
  { path: "/login", element: <Login /> },
  { path: "/select-role", element: <SelectRole /> },
  {
    element: <AppLayout />,
    children: [
      // Public / Landing
      { path: "/", element: <LandingPage /> },
      { path: "blogs", element: <Blogs /> },
      { path: "blogs/:title", element: <BlogDetail /> },

      // Teacher Dashboard (now under AppLayout)
      {
        path: "t_dashboard",
        errorElement: <GeneralError />, // Re-added error element
        element: <TDashboard />,
        children: [
          { path: "", element: <Navigate to="overview" replace /> },
          { path: "overview", element: <OverviewTab /> },
          { path: "syllabus", element: <SyllabusTab /> },
          { path: "mock-exams", element: <MockExamsTab /> },
          { path: "remediation", element: <RemediationTab /> },
        ],
      },

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
      { path: "tests", element: <StudentMaterials /> },
      { path: "videos", element: <StudentMaterials /> },
      { path: "notes", element: <StudentMaterials /> },
      { path: "practice", element: <StudentMaterials /> },
      { path: "notification", element: <Notifications /> },
      { path: "invitation", element: <Invitations /> },

      // Teacher Routes
      {
        path: "teacher",
        children: [
          { path: "dashboard", element: <TeacherDashboard /> },
          { path: "learning-planner", element: <TeacherLearningPlanner /> },
          { path: "materials", element: <TeacherMaterials /> },
          { path: "tests", element: <TeacherMaterials /> },
          { path: "videos", element: <TeacherMaterials /> },
          { path: "notes", element: <TeacherMaterials /> },
        ],
      },

      // Parent Routes
      {
        path: "parent",
        children: [
          { path: "dashboard", element: <ParentDashboard /> },
          { path: "learning-planner", element: <ParentLearningPlanner /> },
          { path: "materials", element: <ParentMaterials /> },
          { path: "tests", element: <ParentMaterials /> },
          { path: "videos", element: <ParentMaterials /> },
          { path: "notes", element: <ParentMaterials /> },
        ],
      },

      // Institute Admin Routes
      {
        path: "institute-admin",
        children: [
          { path: "profile", element: <InstituteAdminProfile /> },
          { path: "dashboard", element: <InstituteAdminDashboard /> },
          { path: "learning-planner", element: <InstituteadminLearningPlanner /> },
          { path: "materials", element: <InstituteAdminMaterials /> },
          { path: "tests", element: <InstituteAdminMaterials /> },
          { path: "videos", element: <InstituteAdminMaterials /> },
          { path: "notes", element: <InstituteAdminMaterials /> },
          { path: "notification", element: <InstituteAdminNotification /> },
        ],
      },

      // Private Tutor Routes
      {
        path: "private-tutor",
        children: [
          { path: "profile", element: <TutorProfile /> },
          { path: "dashboard", element: <TutorDashboard /> },
          { path: "learning-planner", element: <TutorLearningPlanner /> },
          { path: "materials", element: <TutorMaterials /> },
          { path: "tests", element: <TutorMaterials /> },
          { path: "videos", element: <TutorMaterials /> },
          { path: "notes", element: <TutorMaterials /> },
          { path: "notification", element: <TutorNotifications /> },
        ],
      },
    ],
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
  {
    path: "group/",
    element: <PlaceholderPage title="Group Portal - Coming Soon" />,
  },

  // 404 Fallback
  { path: "*", element: <NotFoundPage /> },
];


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

function GeneralError() {
  const error = useRouteError();
  let title = "An unexpected error occurred";
  let message = "We're sorry, something went wrong.";

  if (isRouteErrorResponse(error)) {
    title = `${error.status} ${error.statusText}`;
    message = error.data?.message || "Sorry, an unexpected error has occurred.";
  } else if (error instanceof Error) {
    title = "Application Error";
    message = error.message;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 text-red-800 p-4">
      <div className="text-center bg-white p-8 rounded-2xl shadow-lg border-2 border-red-200">
        <h1 className="text-4xl font-bold mb-2">🚧 {title} 🚧</h1>
        <p className="text-lg mb-4">{message}</p>
        <p className="text-sm text-gray-500 mb-6">Please try refreshing the page, or contact support if the problem persists.</p>
        <a
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors font-semibold"
        >
          Go Back Home
        </a>
      </div>
    </div>
  );
}
