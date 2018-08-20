import Vue from "vue";
import App from "./App";
import router from "./router/index";
import firebase from "firebase";
import store from "./store/store";
import Vuelidate from "vuelidate";

import PaperDashboard from "./plugins/paperDashboard";
import "vue-notifyjs/themes/default.css";


var config = {
  apiKey: "AIzaSyDUC-1jgGVRbBsByLvbGJrtkO_R5pjxJ70",
  databaseURL: "https://ss-beta.firebaseio.com",
  projectId: "ss-beta",
  storageBucket: "ss-beta.appspot.com",
  messagingSenderId: "742012394729"
};

firebase.initializeApp(config);

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
