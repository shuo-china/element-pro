import { h } from "vue";
import { RouterView, type RouteRecordRaw } from "vue-router";
import AdminLayout from "@/layouts/AdminLayout/index.vue";
import router from "@/router";
import type { Menu } from "@/store/menu";

const pageModules = import.meta.glob("../pages/**/*.vue");
const removeRouteCallbacks: Array<() => void> = [];

const RouterViewWrapper = {
  render: () => h(RouterView),
};

function normalizeRoutePath(path: string) {
  return path.startsWith("/") ? path : `/${path}`;
}

function getRouteName(path: string) {
  return `Dynamic${normalizeRoutePath(path).replace(/[^\w]/g, "_")}`;
}

function getChildPath(parentPath: string, childPath: string) {
  const normalizedParentPath = normalizeRoutePath(parentPath);
  const normalizedChildPath = normalizeRoutePath(childPath);
  const relativePath = normalizedChildPath.replace(
    `${normalizedParentPath}/`,
    "",
  );

  return relativePath || "";
}

function getFirstLeafPath(menus: Menu[]): string {
  const firstMenu = menus[0];

  if (!firstMenu) {
    return "/error/404";
  }

  return firstMenu.children.length
    ? getFirstLeafPath(firstMenu.children)
    : firstMenu.path;
}

function getMenuComponent(path: string) {
  const pagePath = normalizeRoutePath(path).replace(/^\//, "");
  const candidates = [
    `../pages/${pagePath}/index.vue`,
    `../pages/${pagePath}.vue`,
  ];

  return candidates.map((candidate) => pageModules[candidate]).find(Boolean);
}

function buildChildRoutes(menus: Menu[], parentPath: string): RouteRecordRaw[] {
  return menus.map((menu) => {
    const children = buildChildRoutes(menu.children, menu.path);
    const firstLeafPath = getFirstLeafPath([menu]);
    const component = children.length
      ? RouterViewWrapper
      : getMenuComponent(menu.path) || (() => import("@/pages/error/404.vue"));

    return {
      path: getChildPath(parentPath, menu.path),
      name: getRouteName(menu.path),
      component,
      redirect: children.length ? firstLeafPath : undefined,
      meta: {
        title: menu.title,
        icon: menu.icon,
      },
      children,
    };
  });
}

function buildDynamicRoutes(menus: Menu[]): RouteRecordRaw[] {
  const firstLeafPath = getFirstLeafPath(menus);
  const rootRoute: RouteRecordRaw = {
    path: "/",
    component: AdminLayout,
    redirect: firstLeafPath,
    children: [],
  };

  return [
    rootRoute,
    ...menus.map((menu) => {
      const children = menu.children.length
        ? buildChildRoutes(menu.children, menu.path)
        : [
            {
              path: "",
              name: getRouteName(menu.path),
              component:
                getMenuComponent(menu.path) ||
                (() => import("@/pages/error/404.vue")),
              meta: {
                title: menu.title,
                icon: menu.icon,
              },
            },
          ];
      const firstLeafPath = getFirstLeafPath([menu]);

      return {
        path: menu.path,
        name: menu.children.length ? getRouteName(menu.path) : undefined,
        component: AdminLayout,
        redirect: menu.children.length ? firstLeafPath : undefined,
        meta: {
          title: menu.title,
          icon: menu.icon,
        },
        children,
      };
    }),
  ];
}

export function resetDynamicRoutes() {
  while (removeRouteCallbacks.length) {
    removeRouteCallbacks.pop()?.();
  }
}

export function setupDynamicRoutes(menus: Menu[]) {
  resetDynamicRoutes();
  buildDynamicRoutes(menus).forEach((route) => {
    removeRouteCallbacks.push(router.addRoute(route));
  });
}
