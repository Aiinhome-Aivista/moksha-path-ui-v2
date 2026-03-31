import React , { useEffect, useRef } from "react";
import { RouterProvider } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { router } from "./routes";
import { AuthProvider } from "./providers/AuthProvider";
import { ThemeProvider } from "./providers/ThemeProvider";
import { AuthProvider as ModalProvider } from "../features/auth/context/AuthContext";
import { ToastProvider, useToast } from "./providers/ToastProvider";
import { SeoProvider } from "../context/SeoContext";
import { NotificationProvider } from "./providers/NotificationProvider";

import {
  requestPermission,
  listenNotifications,
} from "../notifications";
import { POST_APIS } from "../../connection";


const AppContent: React.FC = () => {

  const { showToast } = useToast();
  const authToken = localStorage.getItem("auth_token");

  const initializedRef = useRef(false);

  useEffect(() => {

    if (!authToken) {
      return;
    }

    if (initializedRef.current) return;
    initializedRef.current = true;

    const initNotifications = async () => {

      const fcmToken = await requestPermission();

      if (fcmToken) {

        await fetch(POST_APIS.save_fcm_token, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`,
          },
          body: JSON.stringify({ token: fcmToken }),
        });

      }

      listenNotifications(showToast);
    };

    initNotifications();

  }, [authToken]);

  return <RouterProvider router={router} />;
};

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <SeoProvider>
        <ThemeProvider>
          <AuthProvider>
            <ToastProvider>
              <NotificationProvider>
                <ModalProvider>
                  <AppContent />
                </ModalProvider>
              </NotificationProvider>
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </SeoProvider>
    </HelmetProvider>
  );
};

export default App;

