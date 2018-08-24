import EmptyLayout from "@/layout/empty/EmptyLayout.vue";
import DashboardLayout from "@/layout/dashboard/DashboardLayout.vue";

// GeneralViews
import NotFound from "@/pages/NotFoundPage.vue";

// Unauthenticated pages
import Login from "@/pages/Users/Login.vue";

// Authenticated pages
import PlacesList from "@/pages/Places/List.vue";
import TowersList from "@/pages/Places/Towers/List.vue";
import Tower from "@/pages/Places/Towers/Details.vue";
import UserProfile from "@/pages/Users/UserProfile/Index.vue";

// Admin pages
import UsersList from "@/pages/Users/List.vue";
import CreateUser from "@/pages/Users/Create.vue";
import EditUser from "@/pages/Users/Edit.vue";

const routes = [
  {
    path: "/",
    component: EmptyLayout,
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
        component: EmptyLayout,
        redirect: "/dashboard/index/places",
        children: [
          {
            path: "places",
            component: EmptyLayout,
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
        component: EmptyLayout,
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
