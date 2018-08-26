import Vue from "vue";
import App from "./App";
import router from "./router/index";
import store from "./store/store";
import Vuelidate from "vuelidate";
import VueScrollTo from "vue-scrollto";

import PaperDashboard from "./plugins/paperDashboard";
import "vue-notifyjs/themes/default.css";

import { initializeFirebase } from "./config/firebaseConfig";

initializeFirebase();

Vue.use(VueScrollTo, {
  container: ".main-panel",
  duration: 500,
  easing: "ease"
});

Vue.use(PaperDashboard);
Vue.use(Vuelidate);

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
