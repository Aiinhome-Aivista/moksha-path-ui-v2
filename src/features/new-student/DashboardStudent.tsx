import { Outlet } from "react-router-dom";
import { HeaderProfile } from "./performonce/HeaderProfile";

export const DashboardStudent = () => {
  return (
    <div className="p-6 space-y-6 bg-gray-100 min-h-screen">
      <HeaderProfile />
      <Outlet />
    </div>
  );
};
