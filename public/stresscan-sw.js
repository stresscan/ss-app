importScripts("https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js");

firebase.initializeApp({
  messagingSenderId: "742012394729"
});

const messaging = firebase.messaging();

self.addEventListener("install", event => {
  console.log("Firebabe Messaging SW installed!");
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", event => {
  console.log("Firebabe Messaging SW activated!");
  event.waitUntil(self.clients.claim());
});

self.addEventListener("message", event => {
  console.log("Firebase messaging postMessage received", event.data);
});
