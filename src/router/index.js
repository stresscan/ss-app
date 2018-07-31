import Vue from "vue";
import VueRouter from "vue-router";
import routes from "./routes";
import firebase from "firebase";

Vue.use(VueRouter);

// configure router
const router = new VueRouter({
  routes, // short for routes: routes
  linkActiveClass: "active"
});

router.beforeEach((to, from, next) => {
  console.log("to.fullPath", to.fullPath);
  console.log("from.fullPath", from.fullPath);
  const currentUser = firebase.auth().currentUser;
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  "requiresAuth", requiresAuth;

  console.log("requiresAuth", requiresAuth);
  console.log("currentUser", currentUser);

  if (requiresAuth && !currentUser) next("/app/login");
  else if (!requiresAuth && currentUser) next("/dashboard");
  else next();
});

export default router;
