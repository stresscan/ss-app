import firebase from "firebase";

export const registerServiceWorker = () => {
  if ("serviceWorker" in navigator) {
    if (!navigator.serviceWorker.controller) {
      navigator.serviceWorker
        .register("/stresscan-sw.js")
        .then(reg => {
          console.log("SW registration succeeded. Scope is " + reg.scope);
          firebase.messaging().useServiceWorker(reg);
        })
        .catch(err => {
          console.error("SW registration failed with error " + err);
        });
    } else {
      console.log("service worker already installed");
    }
  }
};
