import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import ApiServices from "../../services/ApiServices";
import { useAuth } from "./AuthProvider";

interface NotificationContextType {
  count: number;
  refresh: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [count, setCount] = useState(0);
  const { isAuthenticated } = useAuth();

  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
        setCount(0);
        return;
    }

    try {
      const [invitesRes, testsRes, mappingRes] = await Promise.all([
        ApiServices.getInviteHistory(),
        ApiServices.getTeacherStudentTestNotification(),
        ApiServices.getPendingMappingRequests(),
      ]);

      let pendingCount = 0;

      // 1. Subscription Invites
      if (invitesRes.data?.status === "success" && invitesRes.data?.data?.received_invites) {
        pendingCount += invitesRes.data.data.received_invites.filter(
          (i: any) => i.status === "Pending"
        ).length;
      }

      // 2. Test Notifications
      if (testsRes.data?.status === "success" && testsRes.data?.data) {
        pendingCount += testsRes.data.data.filter(
          (t: any) => t.status === "Pending"
        ).length;
      }

      // 3. Mapping Requests
      if (mappingRes.data?.status === "success" && mappingRes.data?.data?.users_list) {
        pendingCount += mappingRes.data.data.users_list.filter(
          (p: any) => p.status_label === "Pending" && p.request_type?.toLowerCase() !== "sent"
        ).length;
      }

      setCount(pendingCount);
    } catch (error) {
      console.error("Failed to fetch notification counts:", error);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      refresh();
      // Optional: Polling every 1 minute
      const interval = setInterval(refresh, 60000);
      return () => clearInterval(interval);
    } else {
        setCount(0);
    }
  }, [isAuthenticated, refresh]);

  return (
    <NotificationContext.Provider value={{ count, refresh }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
};
