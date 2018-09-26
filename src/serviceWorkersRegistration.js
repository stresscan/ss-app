export const registerServiceWorkers = () => {
  if ("serviceWorker" in navigator) {
    console.log(
      "registering service worker - controller",
      navigator.serviceWorker.controller
    );
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
  }
};
