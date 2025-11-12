<template>
  <page>
    <div class="flex items-end justify-center gap-x-10">
      <el-scrollbar>
        <el-tabs
          v-loading="groupLoading"
          v-model="currentTabName"
          class="flex-1"
        >
          <el-tab-pane
            v-for="item in groups"
            :label="item.label"
            :name="item.value"
          />
        </el-tabs>
      </el-scrollbar>
    </div>
    <div v-if="!groupLoading" class="mx-auto max-w-[800px]">
      <el-table
        v-loading="configLoading"
        :data="configList"
        :show-header="false"
        size="large"
      >
        <el-table-column :width="130">
          <template #default="{ row }">
            <div class="flex flex-col items-start gap-y-0.5">
              <span>{{ row.title }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column>
          <template #default="{ row }">
            <el-input
              v-if="row.type === 'text'"
              v-model="row.value"
              @change="() => handleUpdateConfigValue(row)"
            />
            <el-input
              v-else-if="row.type === 'textarea'"
              type="textarea"
              v-model="row.value"
              @change="() => handleUpdateConfigValue(row)"
            />
            <el-input-tag
              v-else-if="row.type === 'tags'"
              v-model="row.value"
              @change="() => handleUpdateConfigValue(row)"
            />
            <el-input-number
              v-else-if="row.type === 'number'"
              v-model="row.value"
              @change="() => handleUpdateConfigValue(row)"
            />
            <el-select
              v-else-if="row.type === 'select'"
              v-model="row.value"
              @change="() => handleUpdateConfigValue(row)"
              :options="transformReceiveOptions(row.options)"
            />
            <el-checkbox-group
              v-else-if="row.type === 'checkbox'"
              v-model="row.value"
              @change="() => handleUpdateConfigValue(row)"
              :options="transformReceiveOptions(row.options)"
            />
            <el-switch
              v-else-if="row.type === 'switch'"
              v-model="row.value"
              @change="() => handleUpdateConfigValue(row)"
            />
            <pro-upload
              v-else-if="row.type === 'file'"
              v-model="row.value"
              type="file"
              v-model:file-list="row.files"
              :upload-props="{ limit: 1 }"
              @change="() => handleUpdateConfigValue(row)"
            />
            <pro-upload
              v-else-if="row.type === 'files'"
              v-model="row.value"
              type="file"
              v-model:file-list="row.files"
              :upload-props="{ limit: 9 }"
              @change="() => handleUpdateConfigValue(row)"
            />
            <pro-upload
              v-else-if="row.type === 'image'"
              v-model="row.value"
              type="image"
              v-model:file-list="row.files"
              :upload-props="{ limit: 1 }"
              @change="() => handleUpdateConfigValue(row)"
            />
            <pro-upload
              v-else-if="row.type === 'images'"
              v-model="row.value"
              type="image"
              v-model:file-list="row.files"
              :upload-props="{ limit: 9 }"
              @change="() => handleUpdateConfigValue(row)"
            />
            <div v-if="row.tips" class="mt-1 text-xs text-black/40">
              {{ row.tips }}
            </div>
          </template>
        </el-table-column>
        <el-table-column :width="200">
          <template #default="{ row }">
            <el-tag type="info" effect="light" class="tag-cell max-w-full">
              <div class="flex items-center gap-x-1">
                <div class="overflow-hidden">
                  <div class="truncate py-[1px]">{{ row.name }}</div>
                </div>
                <el-icon :size="15" @click="copy(row.name)">
                  <document-copy />
                </el-icon>
              </div>
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" :width="120">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleUpdateConfig(row)">
              编辑
            </el-button>
            <el-popconfirm
              title="确定要删除吗？"
              @confirm="handleDeleteConfig(row.id)"
            >
              <template #reference>
                <el-button link type="danger">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-button
        class="mt-4 mb-3 h-9 w-full border-dashed"
        plain
        icon="Plus"
        @click="handleCreateConfig"
        >新增配置</el-button
      >
    </div>
  </page>
  <config-form
    :mode="mode"
    :id="editId"
    v-model:visible="formVisible"
    :group-name="currentTabName"
    @finished="refreshConfigList"
  />
</template>

<script setup lang="ts">
import {
  deleteConfigApi,
  getConfigGroupsApi,
  getConfigListApi,
  updateConfigApi,
  type ConfigItem,
} from "@/api/config";
import useRequest from "@/hooks/useRequest";
import ConfigForm from "./ConfigForm.vue";
import {
  transformReceiveValue,
  transformSubmitValue,
  transformReceiveOptions,
} from "./shared";
import { useConfigStore } from "@/store/config";

const configStore = useConfigStore();

const { copy } = useClipboard();
const formVisible = ref(false);
const editId = ref<number>();
const mode = ref<"create" | "update">("create");

const handleCreateConfig = () => {
  formVisible.value = true;
  editId.value = undefined;
  mode.value = "create";
};

const handleUpdateConfig = (row) => {
  formVisible.value = true;
  editId.value = row.id;
  mode.value = "update";
};

const currentTabName = ref();
const { data: groups, loading: groupLoading } = useRequest(getConfigGroupsApi, {
  onSuccess: (res) => {
    currentTabName.value = res[0]?.value;
  },
});

const {
  run,
  data: configList,
  loading: configLoading,
} = useRequest(getConfigListApi, {
  manual: true,
  onSuccess: (data) => {
    data.forEach((item) => {
      item.value = transformReceiveValue(item.type, item.value as string);
    });
  },
});

watch(currentTabName, (val) => {
  run({ group_name: val });
});

const refreshConfigList = () => {
  run({ group_name: currentTabName.value });
};

const handleUpdateConfigValue = (item: ConfigItem) => {
  updateConfigApi(item.id, {
    value: transformSubmitValue(item.type, item.value),
  }).then(() => {
    configStore.init();
  });
};

const handleDeleteConfig = (id: number) => {
  deleteConfigApi(id).then(refreshConfigList);
};
</script>

<style scoped lang="scss">
:deep(.tag-cell .el-tag__content) {
  width: 100%;
}
</style>
