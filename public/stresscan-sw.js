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
  },
  {
    revision: "9878978978978979kjh87",
    url: "/logo.3cc98cff.png"
  }
];

console.log("hello sw!");

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);
  workbox.precaching.precacheAndRoute(self.__precacheManifest || []);

  workbox.routing.registerRoute(
    "https://fonts.googleapis.com",
    workbox.strategies.staleWhileRevalidate({
      cacheName: "google-fonts"
    })
  );

  workbox.routing.registerRoute(
    "https://maxcdn.bootstrapcdn.com",
    workbox.strategies.staleWhileRevalidate({
      cacheName: "font-awesome"
    })
  );

  // workbox.routing.registerRoute(
  //   "https://firebasestorage.googleapis.com",
  //   workbox.strategies.cacheFirst({
  //     plugins: [
  //       new workbox.cacheableResponse.Plugin({
  //         statuses: [0, 200]
  //       })
  //     ]
  //   })
  // );

  workbox.routing.registerRoute(
    "https://firebasestorage.googleapis.com",
    workbox.strategies.staleWhileRevalidate({
      cacheName: "firebase-storage"
    })
  );
} else {
  console.log(`Boo! Workbox didn't load 😬`);
}
