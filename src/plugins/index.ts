import type { App } from "vue";
import ElementPlus from "element-plus";
import router from "@/router";
import pinia from "@/store";
import elementIcons from "./element-icons";
import "@/router/permission";

export async function registerPlugins(app: App) {
  app.use(ElementPlus);
  app.use(elementIcons);
  app.use(router);
  app.use(pinia);
  await router.isReady();
}
