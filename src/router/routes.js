import UnauthenticatedLayout from "@/layout/unauthenticated/Unauthenticated.vue";
import DashboardLayout from "@/layout/dashboard/DashboardLayout.vue";
import DashboardEmptyLayout from "@/layout/dashboard/empty/EmptyLayout.vue";

// GeneralViews
import NotFound from "@/pages/NotFoundPage.vue";

// Unauthenticated pages
import Login from "@/pages/Login.vue";

// Authenticated pages
import PlacesList from "@/pages/Places/PlacesList.vue";
import TowersList from "@/pages/Places/TowersList.vue";
import Tower from "@/pages/Places/Tower.vue";
import UserProfile from "@/pages/UserProfile.vue";

// Admin pages
import UsersList from "@/pages/Users/List.vue";
import CreateUser from "@/pages/Users/Create.vue";
import EditUser from "@/pages/Users/Edit.vue";

const routes = [
  {
    path: "/",
    component: UnauthenticatedLayout,
    redirect: "/login",
    children: [
      {
        path: "login",
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
    redirect: "/dashboard/index",
    children: [
      {
        path: "index",
        component: DashboardEmptyLayout,
        redirect: "/dashboard/index/places",
        children: [
          {
            path: "places",
            component: DashboardEmptyLayout,
            redirect: "/dashboard/index/places/list",
            children: [
              {
                path: "list",
                name: "dashboard -> locais",
                component: PlacesList
              },
              {
                path: ":placeId/towers",
                name: "dashboard -> locais -> torres",
                component: TowersList
              },
              {
                path: ":placeId/tower/:towerId",
                name: "dashboard -> locais -> torres",
                component: Tower
              }
            ]
          }
        ]
      },
      {
        path: "/dashboard/user-profile",
        name: "Perfil",
        component: UserProfile
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
