import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { registerPlugins } from "@/plugins";

async function setupApp() {
  const app = createApp(App);
  await registerPlugins(app);
  app.mount("#app");
}

setupApp();
