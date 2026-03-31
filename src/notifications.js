import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "./firebase";


let listenerInitialized = false;


export const requestPermission = async () => {
  try {

    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      console.log("Notification permission denied");
      return null;
    }

    const token = await getToken(messaging, {
      vapidKey:
        "BN5MPonteDuE_0djNWI1RYQI2OlxOzp8CXdq9Qk9DjPwbm9pctKE7l7aIWl76lAjn_Kw_zHQp6nBo1Uuflzn9kw",
    });

    console.log("FCM Token:", token);

    return token;

  } catch (error) {
    console.error("Error getting notification permission:", error);
    return null;
  }
};


export const listenNotifications = (showToast) => {

  // Prevent multiple listener registrations
  if (listenerInitialized) return;

  listenerInitialized = true;

  onMessage(messaging, (payload) => {

    console.log("Foreground notification received:", payload);

    if (payload?.notification) {

      showToast(
        `${payload.notification.title} — ${payload.notification.body}`,
        "success"
      );

    }

  });

};