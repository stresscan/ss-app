importScripts("https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js");

firebase.initializeApp({
  messagingSenderId: "742012394729"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

console.log("SW Startup!");

self.addEventListener("install", event => {
  console.log("SW installed!");
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", event => {
  console.log("SW activated!");
  event.waitUntil(self.clients.claim());
});

self.addEventListener("message", event => {
  console.log("Firebase messaging postMessage received", event.data);
});
