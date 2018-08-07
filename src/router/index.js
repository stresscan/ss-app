import Vue from "vue";
import VueRouter from "vue-router";
import routes from "./routes";
import firebase from "firebase";

Vue.use(VueRouter);

// configure router
const router = new VueRouter({
  mode: "history",
  routes, // short for routes: routes
  linkActiveClass: "active"
});

router.beforeEach((to, from, next) => {
  const currentUser = firebase.auth().currentUser;
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  "requiresAuth", requiresAuth;

  if (requiresAuth && !currentUser) next("/login");
  else if (!requiresAuth && currentUser) next("/dashboard");
  else next();
});

export default router;
