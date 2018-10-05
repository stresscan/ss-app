import Vue from "vue";
import VueRouter from "vue-router";
import routes from "./routes";
import store from "@/store/store";
import authService from "@/services/AuthService";
import offlineUserService from "@/services/offline/OfflineUsersService";
import usersProfileService from "@/services/UsersProfileService";

Vue.use(VueRouter);

// configure router
const router = new VueRouter({
  //mode: "history",
  routes, // short for routes: routes
  linkActiveClass: "active"
});

const beforeEach = async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  console.log({ requiresAuth });

  if (requiresAuth) {
    const currentUser = authService.getCurrentUser();
    const stateUser = store.state.users.user;
    const offlineUser = await offlineUserService.getUser();

    console.log({ currentUser });
    console.log({ offlineUser });
    console.log({ stateUser });

    if (!currentUser && !offlineUser) {
      next("/login");
    }

    const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin);

    if (requiresAdmin) {
      const isUserAdmin = store.state.users.user.isAdmin;

      if (!isUserAdmin) {
        next("/login");
      }
    }
  }

  next();
};

router.beforeEach(beforeEach);

export default router;
