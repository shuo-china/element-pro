import { resolve } from "path-browserify";
import type { RouteMeta, RouteRecordRaw } from "vue-router";
import { routes } from "@/router";
import { useUserStore } from "./user";
import { access } from "@/router/access";
import { useConfigStore } from "./config";

export type Menu = {
  title: string;
  path: string;
  icon?: string;
  children: Menu[];
};

function gererateMenusByRoutes(routes: RouteRecordRaw[]) {
  const menus: Menu[] = [];

  const { userInfo } = useUserStore();

  if (!userInfo) {
    return [];
  }

  routes.forEach((route) => {
    const menu = generateMenuByRoute(route, (meta) => access(userInfo, meta));
    if (menu) {
      menus.push(menu);
    }
  });

  return menus;
}

function generateMenuByRoute(
  route: RouteRecordRaw,
  permission: (meta?: RouteMeta) => boolean,
  parent: Nullable<Menu> = null,
) {
  if (route.meta?.hidden) return null;
  if (!permission(route.meta)) return null;

  let menu: Menu = {
    title: route.meta?.title || "",
    path: resolve(parent?.path || "", route.path),
    icon: route.meta?.icon,
    children: [],
  };

  if (route.children && route.children.length) {
    route.children.forEach((child) => {
      const childMenu = generateMenuByRoute(child, permission, menu);
      if (childMenu) {
        menu.children.push(childMenu);
      }
    });
  }

  if (menu.children.length === 1) {
    menu = menu.children[0]!;
  }

  return menu;
}

export const useMenuStore = defineStore("menu", () => {
  const currentRoute = useRoute();
  const configStore = useConfigStore();
  const { config } = storeToRefs(configStore);
  const layout = computed(() => config.value?.base.layout || "side");

  const activePaths = computed(() =>
    currentRoute.matched && currentRoute.matched.length
      ? currentRoute.matched.map((item) => item.path)
      : [],
  );

  const topMenus = ref<Menu[]>([]);
  const sideMenus = ref<Menu[]>([]);

  const topActiveKey = computed(() => {
    switch (layout.value) {
      case "top":
        return currentRoute.path;
      case "side":
        return "";
      case "mix":
        let path = "";
        for (let i = 0; i < topMenus.value.length; i++) {
          const menu = topMenus.value[i]!;
          if (activePaths.value.includes(menu.path)) {
            path = menu.path;
            break;
          }
        }
        return path;
    }
  });
  const sideActiveKey = computed(() => {
    switch (layout.value) {
      case "top":
        return "";
      case "side":
      case "mix":
        return currentRoute.path;
    }
  });

  function updateMenus() {
    switch (layout.value) {
      case "top":
        topMenus.value = gererateMenusByRoutes(routes);
        sideMenus.value = [];
        break;
      case "side":
        topMenus.value = [];
        sideMenus.value = gererateMenusByRoutes(routes);
        break;
      case "mix":
        const menus = gererateMenusByRoutes(routes);
        topMenus.value = menus.map((m) => ({ ...m, children: [] }));
        const selectedTopMenu = menus.find((m) =>
          activePaths.value.includes(m.path),
        );
        sideMenus.value = selectedTopMenu?.children || [];
        break;
    }
  }

  watch(layout, () => {
    updateMenus();
  });

  watch(topActiveKey, () => {
    if (layout.value === "mix") {
      updateMenus();
    }
  });

  return {
    layout,
    sideMenus,
    topMenus,
    topActiveKey,
    sideActiveKey,
    updateMenus,
  };
});
