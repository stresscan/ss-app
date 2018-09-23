importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/3.6.1/workbox-sw.js"
);

self.__precacheManifest = [
  {
    revision: "e6263700a4fc6f4732d50800e9e25417",
    url: "/index.html"
  },
  {
    revision: "941835a10dcd04cf798c",
    url: "/app.js"
  }
];

console.log("hello sw!");

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);
  workbox.precaching.precacheAndRoute(self.__precacheManifest || []);

  workbox.routing.registerRoute(
    new RegExp("https://fonts.googleapis.com"),
    workbox.strategies.staleWhileRevalidate({
      cacheName: "google-fonts"
    })
  );

  workbox.routing.registerRoute(
    new RegExp("https://maxcdn.bootstrapcdn.com"),
    workbox.strategies.staleWhileRevalidate({
      cacheName: "font-awesome"
    })
  );

  workbox.routing.registerRoute(
    new RegExp("https://firebasestorage.googleapis.com"),
    workbox.strategies.staleWhileRevalidate({
      cacheName: "firebase-storage"
    })
  );
} else {
  console.log(`Boo! Workbox didn't load 😬`);
}
