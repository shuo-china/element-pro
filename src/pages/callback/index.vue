<template>
  <div
    v-loading="true"
    element-loading-text="页面回调中"
    class="h-full w-full"
  ></div>
</template>

<script setup lang="ts">
import { bindWechatApi } from "@/api/manager";
import { useManagerStore } from "@/store/manager";
import { ElMessage } from "element-plus";

const route = useRoute();
const router = useRouter();

async function handleLogic() {
  switch (route.query.scene) {
    case "bindWechat":
      let errorMessage = void 0;
      try {
        await bindWechatApi(
          {
            id: Number(route.query.managerId),
            code: route.query.code,
          },
          {
            showErrorMessage: false,
          },
        );
      } catch (error: any) {
        errorMessage = error.message;
      }
      await router.replace({ path: "/setting/manager" });
      errorMessage
        ? ElMessage.error(errorMessage)
        : ElMessage.success("绑定成功");

      break;

    case "wechatLogin":
      const managerStore = useManagerStore();
      await managerStore.getAccessToken("wechat", {
        code: route.query.code,
      });
      await router.push("/");
      ElMessage.success("登录成功");
      break;
  }
}

handleLogic();
</script>
