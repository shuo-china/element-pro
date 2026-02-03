<template>
  <page>
    <div class="mb-4">
      <el-button icon="Plus" type="primary" @click="handleCreate">新增角色</el-button>
    </div>
    <pro-table ref="tableRef" :request="getRolePaginationApi">
      <el-table-column prop="name" label="角色名称" />
      <el-table-column prop="key" label="Key" />
      <el-table-column label="操作" fixed="right" :width="140">
        <template #default="{ row }">
          <action-group>
            <action-item>
              <el-button link type="primary" @click="handleUpdate(row)">
                编辑
              </el-button>
            </action-item>
            <action-item>
              <el-button link type="primary" :disabled="!!row.is_top" @click="handleDelete(row.id)">删除</el-button>
            </action-item>
          </action-group>
        </template>
      </el-table-column>
    </pro-table>
    <role-form v-model:visible="formVisible" :id="id" :mode="mode" @finished="tableRef?.refresh()" />
  </page>
</template>

<script setup lang="ts">
import { deleteRoleApi, getRolePaginationApi } from '@/api/role'
import type { ProTableInstance } from '@/components/ProTable/type';
import { ElMessageBox } from 'element-plus';
import RoleForm from './RoleForm.vue'

const tableRef = ref<ProTableInstance>();

const formVisible = ref(false);
const id = ref<number>();
const mode = ref<"create" | "update">("create");

const handleCreate = () => {
  mode.value = "create";
  id.value = undefined;
  formVisible.value = true;
};

const handleUpdate = (item) => {
  mode.value = "update";
  id.value = item.id;
  formVisible.value = true;
};

const handleDelete = (id: number) => {
  ElMessageBox.confirm("确定要删除吗？", {
    type: "warning",
  })
    .then(() => {
      return deleteRoleApi(id);
    })
    .then(() => {
      tableRef.value?.refresh();
    });
};
</script>
