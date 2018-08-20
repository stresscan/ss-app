import Vue from "vue";
import App from "./App";
import router from "./router/index";
import firebase from "firebase";
import store from "./store/store";
import Vuelidate from "vuelidate";
import Croppa from "vue-croppa";

import PaperDashboard from "./plugins/paperDashboard";
import "vue-notifyjs/themes/default.css";

// To crop images
import "vue-croppa/dist/vue-croppa.css";

var config = {
  apiKey: "AIzaSyDUC-1jgGVRbBsByLvbGJrtkO_R5pjxJ70",
  authDomain: "ss-beta.firebaseapp.com",
  databaseURL: "https://ss-beta.firebaseio.com",
  projectId: "ss-beta",
  storageBucket: "ss-beta.appspot.com",
  messagingSenderId: "742012394729"
};

firebase.initializeApp(config);

Vue.use(PaperDashboard);
Vue.use(Vuelidate);
Vue.use(Croppa);

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
