import Vue from "vue";
import VueRouter from "vue-router";
import routes from "./routes";
import authService from "@/services/AuthService";
import store from "@/store/store";
import offlineUserService from "@/services/offline/OfflineUsersService.js";

Vue.use(VueRouter);

// configure router
const router = new VueRouter({
  mode: "history",
  routes, // short for routes: routes
  linkActiveClass: "active"
});

const beforeEach = async (to, from, next) => {
  const user = await authService.getCurrentUser();
  const userOnState = store.state.users.user.uid;
  const offlineUser = await offlineUserService.getUser();
  const isUserAdmin = store.state.users.user.isAdmin;

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin);

  console.log("route", { user });
  console.log("route", { userOnState });
  console.log("route", { offlineUser });
  console.log("route", { isUserAdmin });

  if (!userOnState && to.name !== "login") next("/login");
  else if (requiresAuth && (!user && !offlineUser)) next("/login");
  else if (requiresAdmin && !isUserAdmin) next("/login");
  else next();
};

// router.beforeEach(beforeEach);

export default router;
