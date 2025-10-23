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
    path: "/exception",
    component: AdminLayout,
    meta: {
      hidden: true,
    },
    children: [
      {
        path: "403",
        name: "Forbidden",
        component: () => import("@/pages/exception/403.vue"),
      },
      {
        path: "404",
        name: "Not_Found",
        alias: "/:pathMatch(.*)*",
        component: () => import("@/pages/exception/404.vue"),
      },
    ],
  },
  {
    path: "/test",
    component: AdminLayout,
    redirect: "/test/about",
    meta: {
      title: "测试",
      icon: "Search",
    },
    children: [
      {
        path: "about",
        component: () => import("@/pages/about.vue"),
        meta: {
          title: "关于",
          icon: "Female",
        },
      },
      {
        path: "write",
        component: () => import("@/pages/write.vue"),
        meta: {
          title: "书写",
          icon: "Male",
        },
      },
      {
        path: "user",
        component: () => import("@/pages/user/index.vue"),
        meta: {
          title: "用户列表",
          icon: "User",
        },
      },
    ],
  },
  {
    path: "/test2",
    component: AdminLayout,
    redirect: "/test2/listen",
    meta: {
      title: "听",
      icon: "Loading",
    },
    children: [
      {
        path: "listen",
        component: () => import("@/pages/listen.vue"),
        meta: {
          title: "听",
          icon: "Clock",
        },
      },
      {
        path: "speak",
        component: () => import("@/pages/speak.vue"),
        meta: {
          title: "说",
          icon: "View",
        },
      },
    ],
  },
  {
    path: "/setting",
    component: AdminLayout,
    redirect: "/setting/config",
    meta: {
      title: "设置",
      icon: "Setting",
    },
    children: [
      {
        path: "config",
        component: () => import("@/pages/setting/config/index.vue"),
        meta: {
          title: "配置管理",
          icon: "Operation",
        },
      },
      {
        path: "dict",
        component: () => import("@/pages/setting/dict/index.vue"),
        meta: {
          title: "字典管理",
          icon: "Tickets",
        },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
