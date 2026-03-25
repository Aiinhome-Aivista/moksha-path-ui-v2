import posthog from "./posthog";
import { sendActivityToBackend } from "./activityApi";

export const track = (event: string, payload?: any) => {
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  const data = {
    user_id: user?.id || null,
    role: user?.role || "guest",
    email: user?.email || null,
    event_name: event,
    page: window.location.pathname,
    timestamp: new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
    }),
    ...payload,
  };

  // ✅ PostHog
  posthog.capture(event, data);

  // ✅ YOUR BACKEND DB
  sendActivityToBackend(data);

  console.log("TRACK:", data);
};