// // https://googlechrome.github.io/samples/service-worker/basic/

// importScripts(
//   "https://storage.googleapis.com/workbox-cdn/releases/3.6.1/workbox-sw.js"
// );

// if (workbox) {
//   console.log(`Yay! Workbox is loaded 🎉`);
// } else {
//   console.log(`Boo! Workbox didn't load 😬`);
// }

// console.log("hello ss-sw");

// workbox.routing.registerRoute(
//   new RegExp(".*.js"),
//   workbox.strategies.networkFirst()
// );

// workbox.routing.registerRoute(
//   // Cache CSS files
//   /.*\.css/,
//   // Use cache but update in the background ASAP
//   workbox.strategies.staleWhileRevalidate({
//     // Use a custom cache name
//     cacheName: "css-cache"
//   })
// );

// workbox.routing.registerRoute(
//   // Cache image files
//   /.*\.(?:png|jpg|jpeg|svg|gif)/,
//   // Use the cache if it's available
//   workbox.strategies.cacheFirst({
//     // Use a custom cache name
//     cacheName: "image-cache",
//     plugins: [
//       new workbox.expiration.Plugin({
//         // Cache only 20 images
//         maxEntries: 20,
//         // Cache for a maximum of a week
//         maxAgeSeconds: 7 * 24 * 60 * 60
//       })
//     ]
//   })
// );

// // workbox.precaching.precacheAndRoute([
// //   "/styles/index.0c9a31.css",
// //   "/scripts/main.0d5770.js",
// //   { url: "/index.html", revision: "383676" }
// // ]);

// // const APP_SHELL_PRECACHE = "appShellPrecache-V2";
// // const DATA_CACHE_NAME = "stresscanData-v1";
// // const RUNTIME = "runtime";

// // const APP_SHELL_PRECACHE_URLS = [
// //   "./", // Alias for index.html
// //   "/index.html",
// //   "/css/app.2941bcc8.css",
// //   "/js/app.1679524b.js",
// //   "/js/vendor.fcfe7d58.js",
// //   "/img/themify.cba68f98.svg"
// // ];

// // self.addEventListener("install", event => {
// //   event.waitUntil(
// //     caches
// //       .open(APP_SHELL_PRECACHE)
// //       .then(cache => {
// //         cache.addAll(APP_SHELL_PRECACHE_URLS);
// //       })
// //       .then(self.skipWaiting())
// //   );
// // });

// // self.addEventListener("activate", event => {
// //   console.log("ss sw activated");
// //   const currentCaches = [APP_SHELL_PRECACHE, RUNTIME];
// //   event.waitUntil(
// //     caches
// //       .keys()
// //       .then(cacheNames => {
// //         return cacheNames.filter(
// //           cacheName => !currentCaches.includes(cacheName)
// //         );
// //       })
// //       .then(cachesToDelete => {
// //         console.log({ cachesToDelete });
// //         return Promise.all(
// //           cachesToDelete.map(cacheToDelete => {
// //             return caches.delete(cacheToDelete);
// //           })
// //         );
// //       })
// //       .then(() => self.clients.claim())
// //   );
// // });

// // self.addEventListener("fetch", event => {
// //   console.log("requesting: " + event.request.url);
// //   // Skip cross-origin requests, like those for Google Analytics.
// //   if (event.request.url.startsWith(self.location.origin)) {
// //     event.respondWith(
// //       caches.match(event.request).then(cachedResponse => {
// //         if (cachedResponse) {
// //           console.log("returning the cached version", { cachedResponse });
// //           return cachedResponse;
// //         }

// //         return caches.open(RUNTIME).then(cache => {
// //           return fetch(event.request).then(response => {
// //             // Put a copy of the response in the runtime cache.
// //             return cache.put(event.request, response.clone()).then(() => {
// //               return response;
// //             });
// //           });
// //         });
// //       })
// //     );
// //   }
// // });
