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
import TowerAlerts from "@/pages/Places/Towers/Alerts.vue";
import CreateTower from "@/pages/Places/Towers/Create.vue";
import EditTower from "@/pages/Places/Towers/Edit.vue";
import UserProfile from "@/pages/Users/UserProfile/Index.vue";
import AppSettings from "@/pages/AppSettings.vue";

// Admin pages
// Users:
import UsersList from "@/pages/Users/List.vue";
import CreateUser from "@/pages/Users/Create.vue";
import EditUser from "@/pages/Users/Edit.vue";
// Places and Towers:
import CreatePlace from "@/pages/Places/Create.vue";

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
                name: "locais",
                component: PlacesList
              },
              {
                path: "create",
                name: "novo local",
                component: CreatePlace,
                meta: {
                  requiresAdmin: true
                }
              },
              {
                path: ":placeId/towers/list",
                name: "torres do local",
                component: TowersList
              },
              {
                path: ":placeId/towers/create",
                name: "nova torre",
                component: CreateTower,
                meta: {
                  requiresAdmin: true
                }
              },
              {
                path: ":placeId/tower/:towerId/edit",
                name: "editar torre",
                component: EditTower,
                meta: {
                  requiresAdmin: true
                }
              },
              {
                path: ":placeId/tower/:towerId/alerts",
                name: "alertas da torre",
                component: TowerAlerts
              },
              {
                path: ":placeId/tower/:towerId/details",
                name: "detalhes da torre",
                component: Tower
              }
            ]
          },
          {
            path: "settings",
            name: "configurações",
            component: AppSettings
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
