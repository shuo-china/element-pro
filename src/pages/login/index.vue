<template>
  <div
    class="flex h-full flex-col"
    :style="{ backgroundImage: `url(${bg})`, backgroundSize: '100% 100%' }"
  >
    <div class="flex-1 py-8">
      <div class="flex flex-col px-8 py-6">
        <div class="mt-6 text-center">
          <div class="flex items-center justify-center">
            <img
              class="w-11"
              src="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png"
              alt="logo"
            />
            <span class="ml-4 text-3xl font-bold">{{
              config?.base.title
            }}</span>
          </div>
          <div class="mt-3 mb-6 text-sm text-black/50">
            {{ config?.base.description }}
          </div>
        </div>
        <div class="mx-auto w-80 max-w-[75vw]">
          <el-tabs class="login-type-tabs">
            <el-tab-pane
              v-if="config?.base.loginType.includes('password')"
              label="账号密码登录"
            >
              <password-login />
            </el-tab-pane>
            <el-tab-pane
              v-if="config?.base.loginType.includes('wechat')"
              label="微信扫码登录"
            >
              <wechat-login />
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
    <div class="flex items-center justify-center py-5 text-xs text-black/50">
      {{ config?.base.copyright }}
    </div>
  </div>
</template>

<script setup lang="ts">
import bg from "@/assets/bg.png";
import { useConfigStore } from "@/store/config";
import PasswordLogin from "@/pages/login/PasswordLogin.vue";
import WechatLogin from "@/pages/login/WechatLogin.vue";

const configStore = useConfigStore();
const { config } = storeToRefs(configStore);
</script>

<style lang="scss" scoped>
.login-type-tabs {
  :deep(.el-tabs__header) {
    margin-bottom: 20px;
  }

  :deep(.el-tabs__nav-scroll) {
    display: flex;
    justify-content: center;
  }

  :deep(.el-tabs__nav-wrap) {
    &:after {
      background-color: transparent !important;
    }
  }
}
</style>
