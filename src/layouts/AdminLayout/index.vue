<template>
  <el-container class="h-full">
    <el-header class="flex h-15 items-center border-b border-black/15">
      <div class="h-8 w-47">
        <img
          class="h-full"
          src="https://element-plus.org/images/element-plus-logo.svg"
          alt="logo"
        />
      </div>
      <el-menu
        router
        :default-active="topActiveKey"
        mode="horizontal"
        class="h-full flex-1"
      >
        <MenuItem v-for="item in topMenus" :menu="item" />
      </el-menu>
      <el-dropdown class="h-full">
        <div
          class="flex cursor-pointer items-center px-3 outline-none hover:bg-black/3"
        >
          <el-avatar
            shape="circle"
            :size="32"
            src="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png"
          ></el-avatar>
          <span class="pl-2 text-black/50">{{ userInfo?.nickname }}</span>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </el-header>
    <el-container class="overflow-hidden">
      <el-aside v-if="sideMenus.length" class="w-52">
        <el-scrollbar>
          <el-menu router :default-active="sideActiveKey">
            <MenuItem v-for="item in sideMenus" :key="item.path" :menu="item" />
          </el-menu>
        </el-scrollbar>
      </el-aside>
      <el-main class="bg-[#f0f2f5] p-0">
        <el-scrollbar view-class="flex flex-col h-full">
          <div class="flex-1 p-6">
            <div class="rounded bg-white p-6">
              <el-config-provider :locale="zhCn">
                <router-view></router-view>
              </el-config-provider>
            </div>
          </div>
          <Footer />
        </el-scrollbar>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import zhCn from "element-plus/es/locale/lang/zh-cn";
import { useMenuStore } from "@/store/menu";
import MenuItem from "./MenuItem.vue";
import { useUserStore } from "@/store/user";

const menuStore = useMenuStore();
const userStore = useUserStore();
const router = useRouter();

const { sideMenus, topMenus, sideActiveKey, topActiveKey } =
  storeToRefs(menuStore);

const { userInfo } = storeToRefs(userStore);

const handleLogout = () => {
  userStore.clear();
  router.push("/login");
};
</script>

<style lang="scss" scoped>
.el-menu {
  border: none;
}
</style>
