import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import AdminLayout from "@/layouts/AdminLayout/index.vue";

export const routes: RouteRecordRaw[] = [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/pages/login/index.vue"),
    meta: {
      hidden: true,
    },
  },
  {
    path: "/callback",
    name: "Callback",
    component: () => import("@/pages/callback/index.vue"),
    meta: {
      hidden: true,
    },
  },
  {
    path: "/error",
    component: AdminLayout,
    meta: {
      hidden: true,
    },
    children: [
      {
        path: "403",
        name: "Forbidden",
        component: () => import("@/pages/error/403.vue"),
      },
      {
        path: "404",
        name: "Not_Found",
        alias: "/:pathMatch(.*)*",
        component: () => import("@/pages/error/404.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
