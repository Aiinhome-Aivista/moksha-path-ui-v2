import React from "react";
import { RouterProvider } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { router } from "./routes";
import { AuthProvider } from "./providers/AuthProvider";
import { ThemeProvider } from "./providers/ThemeProvider";
import { AuthProvider as ModalProvider } from "../features/auth/context/AuthContext";
import { ToastProvider } from "./providers/ToastProvider";
import { SeoProvider } from "../context/SeoContext";

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <SeoProvider>
        <ThemeProvider>
          <AuthProvider>
            <ToastProvider>
              <ModalProvider>
                <RouterProvider router={router} />
              </ModalProvider>
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </SeoProvider>
    </HelmetProvider>
  );
};

export default App;

