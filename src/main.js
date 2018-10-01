import Vue from "vue";
import App from "./App";
import router from "./router";
import store from "./store/store";
import Vuelidate from "vuelidate";
import VueScrollTo from "vue-scrollto";
import VuejsDialog from "vuejs-dialog";
import localforage from "localforage";

import PaperDashboard from "./plugins/paperDashboard";
import "vue-notifyjs/themes/default.css";

console.log("firebase config");

// import firebase from "firebase";

// var config = {
//   apiKey: "AIzaSyDUC-1jgGVRbBsByLvbGJrtkO_R5pjxJ70",
//   databaseURL: "https://ss-beta.firebaseio.com",
//   projectId: "ss-beta",
//   storageBucket: "ss-beta.appspot.com",
//   messagingSenderId: "742012394729"
// };

// firebase.initializeApp(config);

// import { initializeFirebase } from "./config/firebaseConfig";
// import { registerServiceWorkers } from "./serviceWorkersRegistration";

// console.log("environment", process.env.NODE_ENV);

// if (process.env.NODE_ENV === "production") {
//   registerServiceWorkers();
// }

// initializeFirebase();

localforage.config({
  name: "stresscan"
});

Vue.use(Vuelidate);

Vue.use(VueScrollTo, {
  container: ".main-panel",
  duration: 500,
  easing: "ease"
});

Vue.use(VuejsDialog, {
  okText: "Confirmar",
  cancelText: "Cancelar",
  animation: "fade"
});

Vue.use(PaperDashboard);

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

// Vue.use(PaperDashboard);

// new Vue({
//   router,
//   render: h => h(App)
// }).$mount("#app");
