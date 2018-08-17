import UnauthenticatedLayout from "@/layout/unauthenticated/Unauthenticated.vue";
import DashboardLayout from "@/layout/dashboard/DashboardLayout.vue";
import DashboardEmptyLayout from "@/layout/dashboard/empty/EmptyLayout.vue";

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
import UsersList from "@/pages/Admin/Users/List.vue";
import CreateUser from "@/pages/Admin/Users/Create.vue";
import EditUser from "@/pages/Admin/Users/Edit.vue";

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
        component: DashboardEmptyLayout,
        redirect: "users/list",
        children: [
          {
            path: "list",
            name: "usuários",
            component: UsersList
          },
          {
            path: "create",
            name: "usuários",
            component: CreateUser
          },
          {
            path: ":id",
            name: "usuários",
            component: EditUser
          }
        ]
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
