importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyAcwgQAwzTRUNt2buoTv4mcntthu8imOoY",
  authDomain: "mokshpath-dd7ca.firebaseapp.com",
  projectId: "mokshpath-dd7ca",
  messagingSenderId: "472395816286",
  appId: "1:472395816286:web:75a68e5b3790ce04aac3cf",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {

  console.log("Background notification received:", payload);

  self.registration.showNotification(
    payload.notification.title,
    {
      body: payload.notification.body,
      icon: "/logo192.png",
    }
  );

});