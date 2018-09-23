import Vue from "vue";
import VueRouter from "vue-router";
import routes from "./routes";
import firebase from "firebase";
import store from "../store/store";

Vue.use(VueRouter);

// configure router
const router = new VueRouter({
  mode: "history",
  routes, // short for routes: routes
  linkActiveClass: "active"
});

router.beforeEach((to, from, next) => {
  const currentUser = firebase.auth().currentUser;
  const offlineCurrentUser = localStorage.getItem("offlineCurrentUser_id");
  const isCurrentUserAdmin = store.state.users.user.isAdmin;
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin);

  console.log({ offlineCurrentUser });

  if (requiresAuth && (!currentUser && !offlineCurrentUser)) next("/login");
  else if (requiresAdmin && !isCurrentUserAdmin) next("/login");
  else next();
});

export default router;
