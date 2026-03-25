import axios from "axios";

export const sendActivityToBackend = async (data: any) => {
  try {
    await axios.post(
      "http://127.0.0.1:8000/api/v1/analytics/log_activity", // adjust if needed
      data
    );
  } catch (error) {
    console.error("Activity log failed", error);
  }
};