import router from "@/router";
import { access } from "./access";
import { useConfigStore } from "@/store/config";
import { useManagerStore } from "@/store/manager";
import { useMenuStore } from "@/store/menu";

const whiteList = ["Login"];

router.beforeEach(async (to, _from, next) => {
  const configStore = useConfigStore();
  if (!configStore.isInitialized) {
    await configStore.init();
  }

  const managerStore = useManagerStore();
  if (!managerStore.token) {
    if (whiteList.includes(to.name as string)) {
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
      await managerStore.getManagerInfo();
      useMenuStore().updateMenus();
    } catch (error) {
      managerStore.clear();
      return next({ name: "Login" });
    }
  }

  for (const route of to.matched) {
    if (!access(managerStore.managerInfo!, route.meta)) {
      return next({ name: "Forbidden" });
    }
  }

  return next();
});
