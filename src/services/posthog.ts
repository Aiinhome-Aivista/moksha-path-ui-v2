import posthog from "posthog-js";

posthog.init("phc_QTG3Kz6La1BL28536wugnIF3XduwvYNh6pVuhGUZN0F", {
  api_host: "https://app.posthog.com",

  capture_pageview: false,
  autocapture: true,
  capture_pageleave: false,
  capture_performance: false,
  disable_session_recording: true,
  disable_persistence: true,
});

export default posthog;