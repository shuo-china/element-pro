import router from "@/router";
import { setupDynamicRoutes } from "@/router/dynamic";
import { useConfigStore } from "@/store/config";
import { useManagerStore } from "@/store/manager";
import { useMenuStore } from "@/store/menu";
import { ApiTokenInvalidError } from "@/utils/request";

const whiteList = ["Login", "Callback"];

router.beforeEach(async (to, _from, next) => {
  const managerStore = useManagerStore();
  if (!managerStore.token) {
    if (whiteList.includes(to.name as string)) {
      await useConfigStore().initBeforeLogin();
      return next();
    } else {
      return next({ name: "Login" });
    }
  }

  if (to.name === "Login") {
    return next("/");
  }

  if (!managerStore.hasManagerInfo) {
    try {
      const menuStore = useMenuStore();
      await managerStore.getManagerInfo();
      await menuStore.updateMenus();
      setupDynamicRoutes(menuStore.menus);
      await useConfigStore().initAfterLogin();
      return next({
        path: to.path,
        query: to.query,
        hash: to.hash,
        replace: true,
      });
    } catch (error) {
      if (!(error instanceof ApiTokenInvalidError)) {
        managerStore.clear();
        return next({ name: "Login" });
      }
    }
  }

  return next();
});
