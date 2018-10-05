import firebase from "firebase/app";

export const initializeFirebase = () => {
  var config = {
    apiKey: "AIzaSyDUC-1jgGVRbBsByLvbGJrtkO_R5pjxJ70",
    databaseURL: "https://ss-beta.firebaseio.com",
    projectId: "ss-beta",
    storageBucket: "ss-beta.appspot.com",
    messagingSenderId: "742012394729"
  };

  firebase.initializeApp(config);

  // navigator.serviceWorker.register("/stresscan-sw.js").then(registration => {
  //   console.log(registration);
  //   firebase.messaging().useServiceWorker(registration);
  // });
};
