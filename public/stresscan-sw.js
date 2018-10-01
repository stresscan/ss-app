// importScripts(
//   "https://storage.googleapis.com/workbox-cdn/releases/3.6.1/workbox-sw.js"
// );

// // self.__precacheManifest = [
// //   {
// //     revision: "e6263700a4fc6f4732d50800e9e25417",
// //     url: "/index.html"
// //   },
// //   {
// //     revision: "941835a10dcd04cf798c",
// //     url: "/app.js"
// //   },
// //   {
// //     revision: "9878978978978979kjh87",
// //     url: "/logo.3cc98cff.png"
// //   }
// // ];

// console.log("hello sw!");

// if (workbox) {
//   console.log(`Yay! Workbox is loaded 🎉`);
//   workbox.precaching.precacheAndRoute(self.__precacheManifest || []);

//   const matchGoogleFontsCss = ({ url, event }) => {
//     console.log("intercepting", { url });

//     const regex = RegExp(/^https:\/\/fonts\.googleapis\.com/).test(url);

//     console.log({ regex });

//     // Return true if the route should match
//     return regex;
//   };

//   // Cache the Google Fonts stylesheets with a stale while revalidate strategy.
//   workbox.routing.registerRoute(
//     matchGoogleFontsCss,
//     workbox.strategies.staleWhileRevalidate({
//       cacheName: "google-fonts-stylesheets"
//     })
//   );

//   const matchGoogleFontsFiles = ({ url, event }) => {
//     console.log("intercepting", { url });

//     const regex = RegExp(/^https:\/\/fonts\.gstatic\.com/).test(url);

//     console.log({ regex });

//     // Return true if the route should match
//     return regex;
//   };

//   // Cache the Google Fonts webfont files with a cache first strategy for 1 year.
//   workbox.routing.registerRoute(
//     matchGoogleFontsFiles,
//     /^https:\/\/fonts\.gstatic\.com/,
//     workbox.strategies.cacheFirst({
//       cacheName: "google-fonts-webfonts",
//       plugins: [
//         new workbox.cacheableResponse.Plugin({
//           statuses: [0, 200]
//         }),
//         new workbox.expiration.Plugin({
//           maxAgeSeconds: 60 * 60 * 24 * 365,
//           maxEntries: 30
//         })
//       ]
//     })
//   );

//   const matchFontAwesomeCss = ({ url, event }) => {
//     console.log("intercepting", { url });

//     const regex = RegExp(/^https:\/\/maxcdn\.bootstrapcdn\.com/).test(url);

//     console.log({ regex });

//     // Return true if the route should match
//     return regex;
//   };

//   workbox.routing.registerRoute(
//     matchFontAwesomeCss,
//     workbox.strategies.staleWhileRevalidate({
//       cacheName: "font-awesome-stylesheets"
//     })
//   );

//   const matchFirebaseStorage = ({ url, event }) => {
//     console.log("intercepting", { url });

//     const regex = RegExp(/^https:\/\/firebasestorage\.googleapis\.com/).test(
//       url
//     );

//     console.log({ regex });

//     // Return true if the route should match
//     return regex;
//   };

//   workbox.routing.registerRoute(
//     matchFirebaseStorage,
//     workbox.strategies.staleWhileRevalidate({
//       cacheName: "firebase-storage"
//     })
//   );
// } else {
//   console.log(`Boo! Workbox didn't load 😬`);
// }
