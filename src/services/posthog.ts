import posthog from "posthog-js";

posthog.init("phc_QTG3Kz6La1BL28536wugnIF3XduwvYNh6pVuhGUZN0F", {
  api_host: "https://app.posthog.com",
  capture_pageview: false, // important
});

export default posthog;