import router from "@/router";
import { access } from "./access";
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
      await managerStore.getManagerInfo();
      await useConfigStore().initAfterLogin();
      useMenuStore().updateMenus();
    } catch (error) {
      if (!(error instanceof ApiTokenInvalidError)) {
        managerStore.clear();
        return next({ name: "Login" });
      }
    }
  }

  for (const route of to.matched) {
    if (!access(managerStore.managerInfo!, route.meta)) {
      return next({ name: "Forbidden" });
    }
  }

  return next();
});
