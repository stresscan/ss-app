importScripts("https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js");

firebase.initializeApp({
  messagingSenderId: "742012394729"
});

const messaging = firebase.messaging();

console.log("SW Startup!");

self.addEventListener("install", function(event) {
  console.log("sw installed!");
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", function(event) {
  console.log("sw activated!");
  event.waitUntil(self.clients.claim());
});

self.addEventListener("message", function(evt) {
  console.log("postMessage received", evt.data);
});
