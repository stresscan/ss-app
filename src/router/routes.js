import UnauthenticatedLayout from "@/layout/unauthenticated/Unauthenticated.vue";
import DashboardLayout from "@/layout/dashboard/DashboardLayout.vue";

// GeneralViews
import NotFound from "@/pages/NotFoundPage.vue";

// Unauthenticated pages
import Login from "@/pages/Login.vue";

// Admin pages
import Dashboard from "@/pages/Dashboard.vue";
import TowersList from "@/pages/TowersList.vue";
import Tower from "@/pages/Tower.vue";
import UserProfile from "@/pages/UserProfile.vue";
import About from "@/pages/About.vue";

import Notifications from "@/pages/Notifications.vue";
import Icons from "@/pages/Icons.vue";
import Maps from "@/pages/Maps.vue";
import Typography from "@/pages/Typography.vue";
import TableList from "@/pages/TableList.vue";

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
      }
    ]
  },
  { path: "*", component: NotFound }
];

const routess = [
  {
    path: "/app/user",
    component: UnauthenticatedLayout,
    redirect: "/login",
    children: [
      {
        path: "login",
        name: "login",
        component: Login
      }
    ]
  },
  {
    path: "/app/dashboard",
    meta: {
      requiresAuth: true
    },
    component: DashboardLayout,
    redirect: "/home",
    children: [
      {
        path: "home",
        name: "home",
        component: Dashboard
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
        path: "notifications",
        name: "notifications",
        component: Notifications
      },
      {
        path: "icons",
        name: "icons",
        component: Icons
      },
      {
        path: "maps",
        name: "maps",
        component: Maps
      },
      {
        path: "typography",
        name: "typography",
        component: Typography
      },
      {
        path: "table-list",
        name: "table-list",
        component: TableList
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
