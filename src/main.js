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

console.log("main config");

import { initializeFirebase } from "./config/firebaseConfig";
import { registerServiceWorkers } from "./serviceWorkersRegistration";

console.log("environment", process.env.NODE_ENV);

if (process.env.NODE_ENV === "production") {
  registerServiceWorkers();
}

initializeFirebase();

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
