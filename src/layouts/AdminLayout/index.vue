<template>
  <el-container class="h-full">
    <el-header class="flex h-15 items-center border-b border-black/15">
      <div class="h-8 w-47">
        <img class="h-full" :src="config?.base.logo" alt="logo" />
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
          <span class="pl-2 text-black/50">{{ managerInfo?.nickname }}</span>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </el-header>
    <el-container class="h-[calc(100vh-60px)]">
      <el-aside v-if="sideMenus.length" class="w-52">
        <el-scrollbar>
          <el-menu router :default-active="sideActiveKey">
            <MenuItem v-for="item in sideMenus" :key="item.path" :menu="item" />
          </el-menu>
        </el-scrollbar>
      </el-aside>
      <el-main class="bg-[#f0f2f5] p-6">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { useMenuStore } from "@/store/menu";
import MenuItem from "./MenuItem.vue";
import { useManagerStore } from "@/store/manager";
import { useConfigStore } from "@/store/config";

const configStore = useConfigStore();
const { config } = storeToRefs(configStore);

const menuStore = useMenuStore();
const managerStore = useManagerStore();
const router = useRouter();

const { sideMenus, topMenus, sideActiveKey, topActiveKey } =
  storeToRefs(menuStore);

const { managerInfo } = storeToRefs(managerStore);

const handleLogout = () => {
  managerStore.clear();
  router.push("/login");
};
</script>

<style lang="scss" scoped>
.el-menu {
  border: none;
}
</style>
