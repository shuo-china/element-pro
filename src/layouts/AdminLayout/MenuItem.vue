<template>
  <el-sub-menu v-if="menu.children?.length" :index="menu.path">
    <template #title>
      <el-icon v-if="menu.icon"><component :is="menu.icon" /></el-icon>
      <span>{{ menu.title }}</span>
    </template>
    <MenuItem v-for="child in menu.children" :key="child.path" :menu="child" />
  </el-sub-menu>
  <el-menu-item v-else :index="menu.path" :route="menu.path">
    <el-icon v-if="menu.icon"><component :is="menu.icon" /></el-icon>
    <span>{{ menu.title }}</span>
  </el-menu-item>
</template>

<script setup lang="ts">
import type { Menu } from "@/store/menu";

interface Props {
  menu: Menu;
}

defineProps<Props>();
</script>
