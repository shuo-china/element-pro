import { getCurrentMenuTreeApi } from "@/api/menu";
import type { Menu as ApiMenu } from "@/api/menu";
import { resolve } from "path-browserify";
import { useConfigStore } from "./config";

export type Menu = {
  title: string;
  path: string;
  icon?: string;
  children: Menu[];
};

function normalizeMenuTree(menuTree: ApiMenu[], parentPath = ""): Menu[] {
  return menuTree.map((menu) => ({
    title: menu.title,
    path: resolve(parentPath, menu.path),
    icon: menu.icon,
    children: normalizeMenuTree(
      menu.children || [],
      resolve(parentPath, menu.path),
    ),
  }));
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
  const menus = ref<Menu[]>([]);

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
  const sideOpenedKeys = computed(() =>
    activePaths.value.filter((path) => path !== currentRoute.path),
  );

  function updateMenusByLayout() {
    switch (layout.value) {
      case "top":
        topMenus.value = menus.value;
        sideMenus.value = [];
        break;
      case "side":
        topMenus.value = [];
        sideMenus.value = menus.value;
        break;
      case "mix":
        topMenus.value = menus.value.map((m) => ({ ...m, children: [] }));
        const selectedTopMenu = menus.value.find((m) =>
          activePaths.value.includes(m.path),
        );
        sideMenus.value = selectedTopMenu?.children || [];
        break;
    }
  }

  async function updateMenus() {
    menus.value = normalizeMenuTree(await getCurrentMenuTreeApi());
    updateMenusByLayout();
  }

  watch(layout, () => {
    updateMenusByLayout();
  });

  watch(topActiveKey, () => {
    if (layout.value === "mix") {
      updateMenusByLayout();
    }
  });

  return {
    layout,
    menus,
    sideMenus,
    topMenus,
    topActiveKey,
    sideActiveKey,
    sideOpenedKeys,
    updateMenus,
  };
});
