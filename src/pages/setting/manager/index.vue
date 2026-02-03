<template>
  <page>
    <div class="mb-4">
      <el-button icon="Plus" type="primary" @click="handleCreate">新增管理员</el-button>
    </div>
    <pro-table ref="tableRef" :request="getManagerPaginationApi">
      <el-table-column prop="username" label="用户名" />
      <el-table-column prop="nickname" label="昵称" />
      <el-table-column prop="mobile" label="手机号" />
      <el-table-column label="角色">
        <template #default="{ row }">
          <div class="flex flex-wrap gap-2">
            <el-tag v-if="row.is_top" effect="plain">最高管理员</el-tag>
            <el-tag v-else v-for="item in row.roles" effect="plain">{{
              item.name
              }}</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="创建时间" />
      <el-table-column label="操作" fixed="right" :width="170">
        <template #default="{ row }">
          <action-group>
            <action-item>
              <el-icon size="24" class="cursor-pointer" @click="handleBindWechat(row)">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
                  <path :fill="row.unionid ? '#2aae67' : '#909399'"
                    d="M690.1 377.4c5.9 0 11.8.2 17.6.5c-24.4-128.7-158.3-227.1-319.9-227.1C209 150.8 64 271.4 64 420.2c0 81.1 43.6 154.2 111.9 203.6a21.5 21.5 0 0 1 9.1 17.6c0 2.4-.5 4.6-1.1 6.9c-5.5 20.3-14.2 52.8-14.6 54.3c-.7 2.6-1.7 5.2-1.7 7.9c0 5.9 4.8 10.8 10.8 10.8c2.3 0 4.2-.9 6.2-2l70.9-40.9c5.3-3.1 11-5 17.2-5c3.2 0 6.4.5 9.5 1.4c33.1 9.5 68.8 14.8 105.7 14.8c6 0 11.9-.1 17.8-.4c-7.1-21-10.9-43.1-10.9-66c0-135.8 132.2-245.8 295.3-245.8m-194.3-86.5c23.8 0 43.2 19.3 43.2 43.1s-19.3 43.1-43.2 43.1c-23.8 0-43.2-19.3-43.2-43.1s19.4-43.1 43.2-43.1m-215.9 86.2c-23.8 0-43.2-19.3-43.2-43.1s19.3-43.1 43.2-43.1s43.2 19.3 43.2 43.1s-19.4 43.1-43.2 43.1m586.8 415.6c56.9-41.2 93.2-102 93.2-169.7c0-124-120.8-224.5-269.9-224.5c-149 0-269.9 100.5-269.9 224.5S540.9 847.5 690 847.5c30.8 0 60.6-4.4 88.1-12.3c2.6-.8 5.2-1.2 7.9-1.2c5.2 0 9.9 1.6 14.3 4.1l59.1 34c1.7 1 3.3 1.7 5.2 1.7a9 9 0 0 0 6.4-2.6a9 9 0 0 0 2.6-6.4c0-2.2-.9-4.4-1.4-6.6c-.3-1.2-7.6-28.3-12.2-45.3c-.5-1.9-.9-3.8-.9-5.7c.1-5.9 3.1-11.2 7.6-14.5M600.2 587.2c-19.9 0-36-16.1-36-35.9s16.1-35.9 36-35.9s36 16.1 36 35.9s-16.2 35.9-36 35.9m179.9 0c-19.9 0-36-16.1-36-35.9s16.1-35.9 36-35.9s36 16.1 36 35.9a36.08 36.08 0 0 1-36 35.9" />
                </svg>
              </el-icon>
            </action-item>
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
    <manager-form v-model:visible="formVisible" :id="id" :mode="mode" @updated="handleUpdated"
      @finished="tableRef?.refresh()" />
  </page>
  <bind-wechat-dialog v-model:visible="bindWechatVisible" :manager-id="bindWechatManagerId" />
</template>

<script setup lang="ts">
import {
  deleteManagerApi,
  getManagerPaginationApi,
  bindWechatApi,
} from "@/api/manager";
import type { ProTableInstance } from "@/components/ProTable/type";
import ManagerForm from "./ManagerForm.vue";
import { useManagerStore } from "@/store/manager";
import { ElMessageBox } from "element-plus";
import BindWechatDialog from "./BindWechatDialog.vue";

const managerStore = useManagerStore();
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

const handleUpdated = (id) => {
  if (id === managerStore.managerInfo?.id) {
    managerStore.getManagerInfo();
  }
};

const handleDelete = (id: number) => {
  ElMessageBox.confirm("确定要删除吗？", {
    type: "warning",
  })
    .then(() => {
      return deleteManagerApi(id);
    })
    .then(() => {
      tableRef.value?.refresh();
    });
};

const bindWechatVisible = ref(false);
const bindWechatManagerId = ref(0);
const handleBindWechat = (row) => {
  if (row.unionid) {
    ElMessageBox.confirm("确定要解绑微信账号吗？", {
      type: "warning",
    })
      .then(() => {
        return bindWechatApi({
          id: row.id,
          unionid: "",
        });
      })
      .then(() => {
        tableRef.value?.refresh();
      });
  } else {
    bindWechatVisible.value = true;
    bindWechatManagerId.value = row.id;
  }
};
</script>

<style lang="scss" scoped></style>
