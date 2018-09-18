importScripts("https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js");

firebase.initializeApp({
  messagingSenderId: "742012394729"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

console.log("Firebase messaging SW Startup!");

self.addEventListener("install", event => {
  console.log("Firebase messaging sw installed!");
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", event => {
  console.log("Firebase messaging sw activated!");
  event.waitUntil(self.clients.claim());
});

self.addEventListener("message", event => {
  console.log("Firebase messaging postMessage received", event.data);
});
