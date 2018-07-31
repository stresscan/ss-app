import Vue from "vue";
import App from "./App";
import router from "./router/index";
import firebase from "firebase";

import PaperDashboard from "./plugins/paperDashboard";
import "vue-notifyjs/themes/default.css";

var config = {
  apiKey: "AIzaSyDUC-1jgGVRbBsByLvbGJrtkO_R5pjxJ70",
  authDomain: "ss-beta.firebaseapp.com",
  databaseURL: "https://ss-beta.firebaseio.com",
  projectId: "ss-beta",
  storageBucket: "ss-beta.appspot.com",
  messagingSenderId: "742012394729"
};

firebase.initializeApp(config);

firebase.auth().onAuthStateChanged(user => {
  if (!app) {
    console.log("started vue app");
    Vue.use(PaperDashboard);

    /* eslint-disable no-new */
    var app = new Vue({
      router,
      render: h => h(App)
    }).$mount("#app");
  }
});

// Vue.use(PaperDashboard);

// new Vue({
//   router,
//   render: h => h(App)
// }).$mount("#app");
