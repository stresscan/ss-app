export const registerServiceWorkers = () => {
  if ("serviceWorker" in navigator) {
    console.log("controller", navigator.serviceWorker.controller);
    //if (!navigator.serviceWorker.controller) {
    navigator.serviceWorker
      .register("/stresscan-sw.js")
      .then(reg => {
        console.log("Yey!", reg);
        console.log(
          "navigator.serviceWorker.controller",
          navigator.serviceWorker.controller
        );
      })
      .catch(err => {
        console.error("Boo!", err);
      });
    // } else {
    //   console.log("service worker already installed");
    // }
  }
};
