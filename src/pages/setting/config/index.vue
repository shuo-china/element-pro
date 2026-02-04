<template>
  <div class="flex h-full gap-x-6 p-6">
    <el-card class="flex-1 overflow-auto" shadow="never">
      <div class="flex items-end justify-center gap-x-10">
        <el-scrollbar>
          <el-tabs v-loading="configGroupListLoading" v-model="currentConfigGroupId" class="flex-1">
            <el-tab-pane v-for="item in configGroupList" :label="item.name" :name="item.id">
              <template #label>{{ item.name }} {{ item.key }}</template>
            </el-tab-pane>
          </el-tabs>
        </el-scrollbar>
      </div>
      <div v-if="!configGroupListLoading" class="mx-auto max-w-[800px]">
        <el-table v-loading="configItemListLoading" :data="configItemList" :show-header="false" size="large">
          <el-table-column :width="130">
            <template #default="{ row }">
              <div class="flex flex-col items-start gap-y-0.5">
                <span>{{ row.name }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column>
            <template #default="{ row }">
              <el-input v-if="row.type === 'text'" v-model="row.value"
                @change="() => handleUpdateConfigItemValue(row)" />
              <el-input v-else-if="row.type === 'textarea'" type="textarea" v-model="row.value"
                @change="() => handleUpdateConfigItemValue(row)" />
              <el-input-tag v-else-if="row.type === 'tags'" v-model="row.value"
                @change="() => handleUpdateConfigItemValue(row)" />
              <el-input-number v-else-if="row.type === 'number'" v-model="row.value"
                @change="() => handleUpdateConfigItemValue(row)" />
              <el-select v-else-if="row.type === 'select'" v-model="row.value"
                @change="() => handleUpdateConfigItemValue(row)" :options="row.options" />
              <el-checkbox-group v-else-if="row.type === 'checkbox'" v-model="row.value"
                @change="() => handleUpdateConfigItemValue(row)" :options="row.options" />
              <el-switch v-else-if="row.type === 'switch'" v-model="row.value"
                @change="() => handleUpdateConfigItemValue(row)" />
              <pro-upload v-else-if="row.type === 'file'" v-model="row.value_raw" type="file"
                v-model:file-list="row.value" :upload-props="{ limit: 1 }"
                @change="() => handleUpdateConfigItemValue(row, row.value_raw)" />
              <pro-upload v-else-if="row.type === 'files'" v-model="row.value_raw" type="file"
                v-model:file-list="row.value" :upload-props="{ limit: 9 }"
                @change="() => handleUpdateConfigItemValue(row, row.value_raw)" />
              <pro-upload v-else-if="row.type === 'image'" v-model="row.value_raw" type="image"
                v-model:file-list="row.value" :upload-props="{ limit: 1 }"
                @change="() => handleUpdateConfigItemValue(row, row.value_raw)" />
              <pro-upload v-else-if="row.type === 'images'" v-model="row.value_raw" type="image"
                v-model:file-list="row.value" :upload-props="{ limit: 9 }"
                @change="() => handleUpdateConfigItemValue(row, row.value_raw)" />
              <div v-if="row.desc" class="mt-1 text-xs text-black/40">
                {{ row.desc }}
              </div>
            </template>
          </el-table-column>
          <el-table-column :width="200">
            <template #default="{ row }">
              <el-tag type="info" effect="light" class="tag-cell max-w-full">
                <div class="flex items-center gap-x-1">
                  <div class="overflow-hidden">
                    <div class="truncate py-[1px]">{{ row.key }}</div>
                  </div>
                  <el-icon :size="15" @click="copy(row.key)">
                    <document-copy />
                  </el-icon>
                </div>
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column fixed="right" :width="120">
            <template #default="{ row }">
              <el-button link type="primary" @click="handleUpdateConfigItem(row)">
                编辑
              </el-button>
              <el-button link type="danger" @click="handleDeleteConfigItem(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button class="mt-4 mb-3 h-9 w-full border-dashed" plain icon="Plus"
          @click="handleCreateConfigItem">新增配置</el-button>
      </div>
    </el-card>
    <el-card class="basis-100 overflow-auto" body-class="flex flex-wrap" shadow="never">
      <div class="mb-4">
        <el-button icon="Plus" type="primary" @click="handleCreateConfigGroup">新增配置组</el-button>
      </div>
      <pro-table :request="getConfigGroupPaginationApi" ref="configGroupTableRef">
        <el-table-column prop="key" label="配置组键" />
        <el-table-column prop="name" label="配置组名称" />
        <el-table-column label="操作" fixed="right" :width="110">
          <template #default="{ row }">
            <action-group>
              <action-item>
                <el-button link type="primary" @click="handleUpdateConfigGroup(row)">
                  编辑
                </el-button>
              </action-item>
              <action-item>
                <el-button link type="primary" :disabled="!!row.is_top"
                  @click="handleDeleteConfigGroup(row.id)">删除</el-button>
              </action-item>
            </action-group>
          </template>
        </el-table-column>
      </pro-table>
    </el-card>
  </div>
  <config-group-form :mode="configGroupMode" :id="configGroupEditId" v-model:visible="configGroupFormVisible"
    @finished="handleConfigGroupFinished" />
  <config-item-form :mode="configItemMode" :id="configItemEditId" v-model:visible="configItemFormVisible"
    :group-id="currentConfigGroupId" @finished="refreshConfigItemList" />
</template>

<script setup lang="ts">
import {
  deleteConfigItemApi,
  getConfigItemListApi,
  updateConfigItemValueApi,
  type ConfigItem,
} from "@/api/config_item";
import {
  deleteConfigGroupApi,
  getConfigGroupPaginationApi,
  getConfigGroupListApi,
} from "@/api/config_group";
import useRequest from "@/hooks/useRequest";
import ConfigGroupForm from "./ConfigGroupForm.vue";
import ConfigItemForm from "./ConfigItemForm.vue";
import { useConfigStore } from "@/store/config";
import { ElMessageBox } from "element-plus";
import type { ProTableInstance } from "@/components/ProTable/type";

const configStore = useConfigStore();

const { copy } = useClipboard();

const configGroupFormVisible = ref(false);
const configGroupEditId = ref<number>();
const configGroupMode = ref<"create" | "update">("create");

const handleCreateConfigGroup = () => {
  configGroupFormVisible.value = true;
  configGroupEditId.value = undefined;
  configGroupMode.value = "create";
};

const handleUpdateConfigGroup = (row) => {
  configGroupFormVisible.value = true;
  configGroupEditId.value = row.id;
  configGroupMode.value = "update";
};

const handleDeleteConfigGroup = (id: number) => {
  ElMessageBox.confirm("确定要删除吗？", {
    type: "warning",
  })
    .then(() => {
      return deleteConfigGroupApi(id);
    })
    .then(() => {
      handleConfigGroupFinished();
    });
};

const configGroupTableRef = ref<ProTableInstance>();
const handleConfigGroupFinished = () => {
  configGroupTableRef.value?.refresh();
  runConfigGroupList();
  configStore.init();
};

const configItemFormVisible = ref(false);
const configItemEditId = ref<number>();
const configItemMode = ref<"create" | "update">("create");

const handleCreateConfigItem = () => {
  configItemFormVisible.value = true;
  configItemEditId.value = undefined;
  configItemMode.value = "create";
};

const handleUpdateConfigItem = (row) => {
  configItemFormVisible.value = true;
  configItemEditId.value = row.id;
  configItemMode.value = "update";
};

const handleDeleteConfigItem = (id: number) => {
  ElMessageBox.confirm("确定要删除吗？", {
    type: "warning",
  })
    .then(() => {
      return deleteConfigItemApi(id);
    })
    .then(() => {
      refreshConfigItemList();
    });
};

const refreshConfigItemList = () => {
  runConfigItemList({ group_id: currentConfigGroupId.value });
};

const currentConfigGroupId = ref();
const { data: configGroupList, loading: configGroupListLoading, run: runConfigGroupList } = useRequest(getConfigGroupListApi, {
  onSuccess: (res) => {
    currentConfigGroupId.value = res[0]?.id;
  },
});

const {
  run: runConfigItemList,
  data: configItemList,
  loading: configItemListLoading,
} = useRequest(getConfigItemListApi, {
  manual: true,
});

watch(currentConfigGroupId, (val) => {
  runConfigItemList({ group_id: val });
});

const handleUpdateConfigItemValue = (item: ConfigItem, value: any = item.value) => {
  updateConfigItemValueApi({
    id: item.id,
    type: item.type,
    value,
  }).then(() => {
    configStore.init();
  });
};
</script>

<style scoped lang="scss">
:deep(.tag-cell .el-tag__content) {
  width: 100%;
}
</style>
