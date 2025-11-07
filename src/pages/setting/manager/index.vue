<template>
  <page>
    <div class="mb-4">
      <el-button icon="Plus" type="primary" @click="addVisible = true"
        >新增管理员</el-button
      >
    </div>
    <pro-table ref="tableRef" :request="getManagerPaginationApi">
      <el-table-column prop="username" label="用户名" />
      <el-table-column prop="nickname" label="昵称" />
      <el-table-column prop="mobile" label="手机号" />
      <el-table-column label="角色">
        <template #default="{ row }">
          <el-tag v-for="item in row.roles">{{ item.name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="创建时间" />
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button link type="primary">编辑</el-button>
          <el-divider direction="vertical" />
          <el-button link type="primary" :disabled="!!row.is_top"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </pro-table>
    <manager-form v-model:visible="addVisible" />
  </page>
</template>

<script setup lang="ts">
import { getManagerPaginationApi } from "@/api/manager";
import type { ProTableInstance } from "@/components/ProTable/type";
import ManagerForm from "./ManagerForm.vue";

const tableRef = ref<ProTableInstance>();

const addVisible = ref(false);
</script>

<style lang="scss" scoped></style>
