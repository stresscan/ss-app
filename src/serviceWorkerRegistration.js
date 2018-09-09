import firebase from "firebase";

export const registerServiceWorker = () => {
  if ("serviceWorker" in navigator) {
    if (!navigator.serviceWorker.controller) {
      // Register service worker
      navigator.serviceWorker
        .register("/service-worker-stresscan.js")
        .then(reg => {
          console.log("SW registration succeeded. Scope is " + reg.scope);
          console.log(
            "navigator.serviceWorker.controller",
            navigator.serviceWorker.controller
          );
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
