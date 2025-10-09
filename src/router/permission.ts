import router from "@/router";
import { access } from "./access";
import { useUserStore } from "@/store/user";
import { useMenuStore } from "@/store/menu";

const whiteList = ["Login"];

router.beforeEach(async (to, _from, next) => {
  const userStore = useUserStore();

  if (!userStore.token) {
    if (whiteList.includes(to.name as string)) {
      return next();
    } else {
      return next({ name: "Login" });
    }
  }

  if (to.name === "Login") {
    return next("/");
  }

  if (!userStore.hasUserInfo) {
    try {
      await userStore.getUserInfo();
      useMenuStore().updateMenus();
    } catch (error) {
      userStore.clear();
      return next({ name: "Login" });
    }
  }

  for (const route of to.matched) {
    if (!access(userStore.userInfo!, route.meta)) {
      return next({ name: "Forbidden" });
    }
  }

  return next();
});
