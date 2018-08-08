import UnauthenticatedLayout from "@/layout/unauthenticated/Unauthenticated.vue";
import DashboardLayout from "@/layout/dashboard/DashboardLayout.vue";

// GeneralViews
import NotFound from "@/pages/NotFoundPage.vue";

// Unauthenticated pages
import Login from "@/pages/Login.vue";

// Authenticated pages
import Dashboard from "@/pages/Dashboard.vue";
import TowersList from "@/pages/TowersList.vue";
import Tower from "@/pages/Tower.vue";
import UserProfile from "@/pages/UserProfile.vue";
import About from "@/pages/About.vue";

// Admin pages
import Users from "@/pages/Admin/Users.vue";

const routes = [
  {
    path: "/",
    component: UnauthenticatedLayout,
    redirect: "/login",
    children: [
      {
        path: "login",
        name: "Login",
        component: Login
      }
    ]
  },
  {
    path: "/dashboard",
    meta: {
      requiresAuth: true
    },
    component: DashboardLayout,
    redirect: "/dashboard/home",
    children: [
      {
        path: "home",
        name: "Dashboard",
        component: Dashboard
      },
      {
        path: "user-profile",
        name: "Perfil",
        component: UserProfile
      },
      {
        path: "towers",
        name: "torres",
        component: TowersList
      },
      {
        path: "tower",
        name: "torre",
        component: Tower
      },
      {
        path: "user-profile",
        name: "meus dados",
        component: UserProfile
      },
      {
        path: "about",
        name: "about",
        component: About
      },
      {
        path: "users",
        meta: {
          requiresAdmin: true
        },
        name: "usuários",
        component: Users
      }
    ]
  },
  { path: "*", component: NotFound }
];

/**
 * Asynchronously load view (Webpack Lazy loading compatible)
 * The specified component must be inside the Views folder
 * @param  {string} name  the filename (basename) of the view to load.
function view(name) {
   var res= require('../components/Dashboard/Views/' + name + '.vue');
   return res;
};**/

export default routes;
