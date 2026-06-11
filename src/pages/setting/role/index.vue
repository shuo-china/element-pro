<template>
  <page>
    <div class="mb-4">
      <el-button icon="Plus" type="primary" @click="handleCreate"
        >新增角色</el-button
      >
    </div>
    <pro-table ref="tableRef" :request="getRolePaginationApi">
      <el-table-column prop="name" label="角色名称" />
      <el-table-column prop="key" label="Key" />
      <el-table-column label="操作" fixed="right" :width="220">
        <template #default="{ row }">
          <action-group>
            <action-item>
              <el-button link type="primary" @click="handlePermission(row)">
                权限设置
              </el-button>
            </action-item>
            <action-item>
              <el-button link type="primary" @click="handleUpdate(row)">
                编辑
              </el-button>
            </action-item>
            <action-item>
              <el-button
                link
                type="primary"
                :disabled="!!row.is_top"
                @click="handleDelete(row.id)"
                >删除</el-button
              >
            </action-item>
          </action-group>
        </template>
      </el-table-column>
    </pro-table>
    <role-form
      v-model:visible="formVisible"
      :id="id"
      :mode="mode"
      @finished="tableRef?.refresh()"
    />
    <el-dialog
      v-model="permissionVisible"
      title="权限设置"
      width="520px"
      destroy-on-close
    >
      <div class="max-h-120 overflow-y-auto" v-loading="permissionLoading">
        <el-tree
          ref="permissionTreeRef"
          :data="permissionMenuTree"
          :props="treeProps"
          node-key="id"
          show-checkbox
          default-expand-all
        />
      </div>
      <template #footer>
        <el-button @click="permissionVisible = false">取消</el-button>
        <el-button
          type="primary"
          :loading="permissionSaving"
          @click="handlePermissionSubmit"
        >
          保存
        </el-button>
      </template>
    </el-dialog>
  </page>
</template>

<script setup lang="ts">
import { getMenuTreeApi, type Menu } from "@/api/menu";
import {
  deleteRoleApi,
  getRoleMenusApi,
  getRolePaginationApi,
  updateRoleMenusApi,
} from "@/api/role";
import type { ProTableInstance } from "@/components/ProTable/type";
import { ElMessage, ElMessageBox, ElTree } from "element-plus";
import RoleForm from "./RoleForm.vue";

const tableRef = ref<ProTableInstance>();
const permissionTreeRef = ref<InstanceType<typeof ElTree>>();

const formVisible = ref(false);
const id = ref<number>();
const mode = ref<"create" | "update">("create");
const permissionVisible = ref(false);
const permissionLoading = ref(false);
const permissionSaving = ref(false);
const permissionRoleId = ref<number>();
const permissionMenuTree = ref<Menu[]>([]);
const treeProps = {
  label: "title",
  children: "children",
};

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

const handlePermission = async (item) => {
  permissionRoleId.value = item.id;
  permissionVisible.value = true;
  permissionLoading.value = true;

  try {
    const [menus, menuIds] = await Promise.all([
      getMenuTreeApi(),
      getRoleMenusApi(item.id),
    ]);
    permissionMenuTree.value = menus;

    await nextTick();
    permissionTreeRef.value?.setCheckedKeys(menuIds);
  } finally {
    permissionLoading.value = false;
  }
};

const handlePermissionSubmit = async () => {
  if (!permissionRoleId.value) return;

  permissionSaving.value = true;
  try {
    await updateRoleMenusApi({
      id: permissionRoleId.value,
      menu_ids: permissionTreeRef.value?.getCheckedKeys(false) as number[],
    });
    ElMessage.success("保存成功");
    permissionVisible.value = false;
  } finally {
    permissionSaving.value = false;
  }
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
